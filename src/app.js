/**
 * @file
 * Configure and start our server
 */

// Config
import {config} from '@dbcdk/biblo-config';

// newrelic needs to be required the es5 way because we only wants to load new relic if specified in config.js
const newrelic = config.get('NewRelic.enabled') && require('newrelic') || null;

// Libraries
import express from 'express';
import * as path from 'path';
import Logger from 'dbc-node-logger';
import RedisStore from 'connect-redis';
import ServiceProviderSetup from './server/serviceProvider/ServiceProviderSetup.js';
import AWS from 'aws-sdk';
import ProxyAgent from 'proxy-agent';
import Primus from 'primus';

// Utils
import {createQueue} from './app.utils';

// Routes
import MainRoutes from './server/routes/main.routes.js';
import GroupRoutes from './server/routes/group.routes';
import SearchRoutes from './server/routes/search.routes';
import WorkRoutes from './server/routes/work.routes';
import ReviewRoutes from './server/routes/review.routes';
import ProfileRoutes from './server/routes/profile.routes';
import CampaignRoutes from './server/routes/campaign.routes';
import ContentRoutes from './server/routes/content.routes';
import ApiRoutes from './server/routes/api.routes';
import PreviewRoutes from './server/routes/preview.routes';
import {wildCardRoute} from './server/routes/content.routes';

// Passport Strategies
import * as PassportStrategies from './server/PassportStrategies/strategies.passport';

// Middleware
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import compression from 'compression';
import expressSession from 'express-session';
import helmet from 'helmet';
import {GlobalsMiddleware} from './server/middlewares/globals.middleware';
import {ssrMiddleware} from './server/middlewares/serviceprovider.middleware';
import {ensureProfileImage, reduxStateMiddleware, fullProfileOnSession, renderComponent, ConfigurationMiddleware} from './server/middlewares/data.middleware';
import {ensureUserHasProfile, ensureUserHasValidLibrary} from './server/middlewares/auth.middleware';

// Queue processors
import {processUserMessage} from './server/queues/UserMessages.queue';
import {processUserStatusCheck} from './server/queues/CheckUserStatus.queue';
import {processCheckForNewQuarantines} from './server/queues/checkForNewQuarantines.queue';
import {notifyUsersRelevantToComment} from './server/queues/notifyUsersRelevantToAComment.queue';

// Change handlers
import {
  quarantinesChangeStreamHandler,
  commentWasAddedUserMessageChangeStreamHandler,
  postWasAddedEmitToClientsChangeStreamHandler,
  commentWasAddedEmitToClientsChangeStreamHandler
} from './server/serviceProvider/handlers/ChangeStream.handlers';

module.exports.run = function (worker) {
  // Setup
  const BIBLO_CONFIG = config;
  const app = express();
  const server = worker.httpServer;
  const scServer = worker.getSCServer();
  const ENV = app.get('env');
  const PRODUCTION = ENV === 'production';
  const APP_NAME = config.get('NewRelic.app_name');
  const APPLICATION = 'biblo';
  const KAFKA_TOPIC = config.get('Logger.KAFKA_TOPIC');
  const logger = new Logger({app_name: APP_NAME});
  const expressLoggers = logger.getExpressLoggers();

  // Direct requests to app
  server.on('request', app);
  // robots.txt handler
  app.get('/robots.txt', (req, res) => {
    if (config.get('Biblo.showInSearchEngines')) {
      res.type('text/plain');
      res.send('User-agent: *\nDisallow: /api/');
    }
    else {
      res.type('text/plain');
      res.send('User-agent: *\nDisallow: /');
    }
  });

  // error handler
  app.use((req, res, next) => {
    try {
      next();
    }
    catch (err) {
      logger.error(
        'An unknown error occurred',
        {error: (err.message && err.name ? {message: err.message, name: err.name} : err)}
      );
    }
  });

  // Set the configuration middleware early so we always have it available.
  app.use(ConfigurationMiddleware);

  // Setting bodyparser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // Helmet configuration
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy({setTo: 'Konami!'}));
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());

  // Port config
  app.set('port', config.get('Biblo.port'));

  // Configure amazon
  const amazonConfig = {
    region: config.get('ServiceProvider.aws.region'),
    accessKeyId: config.get('ServiceProvider.aws.keyId'),
    secretAccessKey: config.get('ServiceProvider.aws.key')
  };
  AWS.config.update(amazonConfig);

  if (config.get('Proxy.http_proxy')) {
    AWS.config.update({
      httpOptions: {
        agent: new ProxyAgent(config.get('Proxy.http_proxy'))
      }
    });
  }

  // Initialize DynamoDB
  const tableName = config.get('ServiceProvider.aws.DynamoDB.tableName') || `biblo_${ENV}_${KAFKA_TOPIC}_message_table`;
  const dynamodb = new AWS.DynamoDB({apiVersion: config.get('ServiceProvider.aws.DynamoDB.apiVersion')});
  const docClient = new AWS.DynamoDB.DocumentClient({service: dynamodb});

  // List tables in dynamo db
  dynamodb.listTables({}, (err, data) => {
    if (!err && data) {
      // check for our table name
      if ((data.TableNames || []).indexOf(tableName) === -1) {
        const tableDef = {
          TableName: tableName,
          KeySchema: [
            {AttributeName: 'messageType', KeyType: 'HASH'},  // Partition key
            {AttributeName: 'createdEpoch', KeyType: 'RANGE'}  // Sort key
          ],
          AttributeDefinitions: [
            {AttributeName: 'messageType', AttributeType: 'S'},
            {AttributeName: 'createdEpoch', AttributeType: 'N'},
            {AttributeName: 'message', AttributeType: 'S'},
            {AttributeName: 'userId', AttributeType: 'S'}
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'uderId-message-index',
              KeySchema: [
                {
                  AttributeName: 'userId',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: 'message',
                  KeyType: 'RANGE'
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: config.get('ServiceProvider.aws.DynamoDB.readCap'),
                WriteCapacityUnits: config.get('ServiceProvider.aws.DynamoDB.writeCap')
              }
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: config.get('ServiceProvider.aws.DynamoDB.readCap'),
            WriteCapacityUnits: config.get('ServiceProvider.aws.DynamoDB.writeCap')
          }
        };

        // if it doesn't exist -> create it.
        dynamodb.createTable(tableDef, (createTableErr, createTableData) => {
          if (!createTableErr && createTableData) {
            logger.info('Created dynamo table!', createTableData);
          }
          else {
            logger.error('Cannot create dynamo table, messages will be disabled!');
          }
        });
      }
    }
    else {
      logger.error('Cannot connect to dynamo, messages will be disabled!');
    }
  });

  // Configure service provider
  const sp = ServiceProviderSetup(config, logger, worker);

  // Configure app variables
  app.set('serviceProvider', sp);
  app.set('logger', logger);
  app.set('APPLICATION', APPLICATION);
  app.set('Configuration', config);
  app.set('BIBLO_CONFIG', BIBLO_CONFIG);
  app.set('amazonConfig', amazonConfig);
  app.set('s3', new AWS.S3());
  app.set('ElasticTranscoder', new AWS.ElasticTranscoder());
  app.set('dynamoTable', tableName);
  app.set('dynamoDocClient', docClient);

  // Configure templating
  app.set('views', path.join(__dirname, 'server/templates'));
  app.set('view engine', 'pug');

  // Setting proxy
  app.enable('trust proxy');

  // settings production specific options
  if (newrelic) {
    app.locals.newrelic = true;
  }

  // setting local vars that should be available to our template engine
  app.locals.env = ENV;
  app.locals.production = PRODUCTION;
  app.locals.title = config.get('Biblo.applicationTitle');
  app.locals.application = APPLICATION;
  app.locals.faviconUrl = '/favicon.ico';

  // Setup environments
  const fileHeaders = PRODUCTION && {index: false, dotfiles: 'ignore', maxAge: '5 days'} || {};

  // Queue handlers
  const queueCreate = createQueue.bind(null, logger, app);

  // Configure message queue
  const userMessageQueue = queueCreate('user messages', processUserMessage);

  /**
   * Helper method to remember the required
   * @param {Number|String} userId
   * @param {String} messageType
   * @param {PlainObject} message
   */
  function userMessageAdd(userId, messageType, message) {
    return userMessageQueue.add({userId, messageType, message});
  }

  // Configure user status queue
  const userStatusCheckQueue = queueCreate('user status check', processUserStatusCheck);

  // Configure user status queue
  const checkForNewQuarantinesQueue = queueCreate('quarantine check', processCheckForNewQuarantines);

  // Configure addedCommentQueue
  const addedCommentQueue = queueCreate('addedCommentQueue', notifyUsersRelevantToComment);

  // Set queues to app
  app.set('userMessageAdd', userMessageAdd);
  app.set('userMessageQueue', userMessageQueue);
  app.set('userStatusCheckQueue', userStatusCheckQueue);
  app.set('checkForNewQuarantinesQueue', checkForNewQuarantinesQueue);
  app.set('addedCommentQueue', addedCommentQueue);

  const redisStore = RedisStore(expressSession);

  const redisInstance = new redisStore({
    host: config.get('Redis.host'),
    port: config.get('Redis.port'),
    prefix: APP_NAME + '_session_'
  });

  redisInstance.client.on('error', function () {
    logger.log('debug', 'ERROR: Redis server not found! No session storage available.');
  });

  const cookieExpires = new Date();
  cookieExpires.setHours(22, 0, 0, 0);

  const sessionMiddleware = expressSession({
    store: redisInstance,
    secret: config.get('Sessions.secret') + APP_NAME,
    name: APP_NAME,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: PRODUCTION,

      // Expire the cookie at 22:00, one hour after closing the site.
      expires: cookieExpires
    }
  });

  // Adding gzip'ing
  app.use(compression());

  // Setting paths
  app.use(express.static(path.join(__dirname, '../public'), fileHeaders));
  app.use(express.static(path.join(__dirname, '../static'), fileHeaders));

  // Setting logger
  app.use(expressLoggers.logger);

  // Setting Input Validation
  const validatorOptions = {
    customValidators: {
      isEqual: (a, b) => {
        return a === b;
      }
    }
  };
  app.use(expressValidator(validatorOptions));

  // Setting sessions
  app.use(sessionMiddleware);

  scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, (req, next) => {
    sessionMiddleware(req.socket.request, {}, next);
  });

  // Setup passport
  PassportStrategies.Unilogin(app, config.get('UNILogin'));

  // Setting middleware
  app.use(GlobalsMiddleware);
  app.use(ssrMiddleware);
  app.use(ensureProfileImage);
  app.use(reduxStateMiddleware);
  app.use(renderComponent);

  // This middleware sets the git sha to locals so we can render it in the template
  // We do this to ensure we know exactly what's deployed.
  app.use((req, res, next) => {
    if (process.env.GIT_COMMIT) { // eslint-disable-line
      res.locals.gitsha = process.env.GIT_COMMIT; // eslint-disable-line
    }

    next();
  });

  app.use('/anmeldelse', fullProfileOnSession, ensureUserHasValidLibrary, ReviewRoutes);
  app.use('/grupper', ensureUserHasProfile, fullProfileOnSession, ensureUserHasValidLibrary, GroupRoutes);
  app.use('/find', fullProfileOnSession, ensureUserHasValidLibrary, SearchRoutes);
  app.use('/profil', fullProfileOnSession, ProfileRoutes);
  app.use('/kampagne', fullProfileOnSession, CampaignRoutes);
  app.use('/materiale', fullProfileOnSession, ensureUserHasValidLibrary, WorkRoutes);
  app.use('/indhold', fullProfileOnSession, ensureUserHasValidLibrary, ContentRoutes);
  app.use('/api', ApiRoutes);
  app.use('/preview', PreviewRoutes);
  app.use('/', MainRoutes);

  // middleware like route to catch all non-caught routes.
  app.use(wildCardRoute);

  // Graceful handling of errors
  app.use((err, req, res, next) => {
    logger.log('error', 'An error occurred! Got following: ' + err, {url: req.url, session: req.session});
    console.error('error', 'An error occurred! Got following: ' + err.stack, {url: req.url, session: req.session}); // eslint-disable-line no-console
    if (res.headersSent) {
      return next(err);
    }

    res.status(500);
    return res.render('error', {errorData: '{\"statusCode\":500}'});
  });

  // Handle 404's
  app.use((req, res) => {
    res.status(404);
    res.render('error', {errorData: '{\"statusCode\":404}'});
  });

  // Setting logger -- should be placed after routes
  app.use(expressLoggers.errorLogger);

  // We only want one connection per server.
  if (worker.isLeader) {
    // First we connect to the community service via primus
    const bibloCsUrl = config.get('CommunityService.endpoint');
    const primus = new (Primus.createSocket({transformer: 'websockets', iknowclusterwillbreakconnections: true}))(bibloCsUrl);

    // Whenever we get some data from the service, we hit this function
    primus.on('data', function (data) {
      // We only want to act on objects with events.
      if (typeof data === 'object' && data.event) {
        // Each event has different handlers
        switch (data.event) {
          case 'quarantineChanged': {
            return [quarantinesChangeStreamHandler(app, data)];
          }
          case 'postChanged': {
            return [postWasAddedEmitToClientsChangeStreamHandler(app, scServer, data)];
          }
          case 'commentChanged': {
            return [
              commentWasAddedUserMessageChangeStreamHandler(app, data),
              commentWasAddedEmitToClientsChangeStreamHandler(app, scServer, data)
            ];
          }
          default: {
            return [];
          }
        }
      }

      return [];
    });
  }

  logger.debug('>> Worker PID: ' + process.pid);
  logger.debug('Server listening on port ' + app.get('port'));
  logger.debug('NEW_RELIC_APP_NAME: ' + APP_NAME);
  logger.debug('APPLICATION: ' + APPLICATION);
};
