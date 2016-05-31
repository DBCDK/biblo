/**
 * @file
 * Configure and start our server
 */

// Config
import config from '@dbcdk/biblo-config';
// newrelic needs to be required the es5 way because we only wants to load new relic if specified in config.js
const newrelic = config.biblo.getConfig({}).newrelic.enabled && require('newrelic') || null;

// Libraries
import express from 'express';
import * as path from 'path';
import Logger from 'dbc-node-logger';
import RedisStore from 'connect-redis';
import ServiceProviderSetup from './server/serviceProvider/ServiceProviderSetup.js';
import AWS from 'aws-sdk';
import ProxyAgent from 'proxy-agent';
import Queue from 'bull';

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
import {ensureProfileImage} from './server/middlewares/data.middleware';
import {ensureUserHasProfile, ensureUserHasValidLibrary} from './server/middlewares/auth.middleware';

// Queue processors
import {processUserMessage} from './server/queues/UserMessages.queue';
import {processUserStatusCheck} from './server/queues/CheckUserStatus.queue';

module.exports.run = function (worker) {
  // Setup
  const BIBLO_CONFIG = config.biblo.getConfig({});
  const app = express();
  const server = worker.httpServer;
  const scServer = worker.getSCServer();
  const ENV = app.get('env');
  const PRODUCTION = ENV === 'production';
  const APP_NAME = process.env.NEW_RELIC_APP_NAME || 'biblo'; // eslint-disable-line no-process-env
  const APPLICATION = 'biblo';
  const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'local'; // eslint-disable-line no-process-env
  const logger = new Logger({app_name: APP_NAME});
  const expressLoggers = logger.getExpressLoggers();

  // Direct requests to app
  server.on('request', app);
  // robots.txt handler
  app.get('/robots.txt', (req, res) => {
    if (process.env.SHOW_IN_SEARCH_ENGINES) { // eslint-disable-line no-process-env
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

  // Setting bodyparser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // Helmet configuration
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy({setTo: 'Konami!'}));
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());

  // Port config
  app.set('port', process.env.PORT || 8080); // eslint-disable-line no-process-env

  // EMAIL Redirect requires port to be defined therefore it must come after
  const EMAIL_REDIRECT = process.env.EMAIL_REDIRECT || 'localhost:' + app.get('port'); // eslint-disable-line no-process-env

  // Configure amazon
  let amazonConfig;

  if (process.env.AMAZON_S3_KEY && process.env.AMAZON_S3_KEYID) { // eslint-disable-line no-process-env
    amazonConfig = {
      key: process.env.AMAZON_S3_KEY, // eslint-disable-line no-process-env
      keyId: process.env.AMAZON_S3_KEYID // eslint-disable-line no-process-env
    };
  }
  else if (require('@dbcdk/biblo-config').communityservice.amazon) {
    amazonConfig = require('@dbcdk/biblo-config').communityservice.amazon;
  }
  else {
    amazonConfig = {
      key: '',
      keyId: ''
    };
  }

  AWS.config.update({
    region: amazonConfig.region,
    accessKeyId: amazonConfig.keyId,
    secretAccessKey: amazonConfig.key
  });

  if (process.env.http_proxy) { // eslint-disable-line no-process-env
    AWS.config.update({
      httpOptions: {
        agent: new ProxyAgent(process.env.http_proxy) // eslint-disable-line no-process-env
      }
    });
  }

  // Initialize DynamoDB
  const tableName = process.env.DYNAMO_TABLE_NAME || `biblo_${ENV}_${KAFKA_TOPIC}_messages`; // eslint-disable-line no-process-env
  let dynamodb = new AWS.DynamoDB();
  let docClient = new AWS.DynamoDB.DocumentClient();

  // List tables in dynamo db
  dynamodb.listTables({}, (err, data) => {
    if (!err && data) {
      // check for our table name
      if ((data.TableNames || []).indexOf(tableName) === -1) {
        const tableDef = {
          TableName: tableName,
          KeySchema: [
            {AttributeName: 'messageEpoch', KeyType: 'HASH'},  // Partition key
            {AttributeName: 'messageType', KeyType: 'RANGE'}  // Sort key
          ],
          AttributeDefinitions: [
            {AttributeName: 'messageEpoch', AttributeType: 'S'},
            {AttributeName: 'messageType', AttributeType: 'S'}
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: process.env.DYNAMO_READ_CAP || 10,
            WriteCapacityUnits: process.env.DYNAMO_WRITE_CAP || 10
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

  // Configure app variables
  app.set('serviceProvider', ServiceProviderSetup(BIBLO_CONFIG, logger, worker));
  app.set('logger', logger);
  app.set('EMAIL_REDIRECT', EMAIL_REDIRECT);
  app.set('APPLICATION', APPLICATION);
  app.set('Configuration', config);
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
  app.locals.title = BIBLO_CONFIG.applicationTitle || 'Biblo'; // eslint-disable-line no-process-env
  app.locals.application = APPLICATION;
  app.locals.faviconUrl = '/favicon.ico';

  // Setup environments
  let redisConfig;
  let fileHeaders = {};

  // Redis
  switch (ENV) {
    case 'development':
      redisConfig = BIBLO_CONFIG.sessionStores.redis.development; // eslint-disable-line no-process-env
      break;
    case 'production':
      redisConfig = BIBLO_CONFIG.sessionStores.redis.production; // eslint-disable-line no-process-env
      fileHeaders = {index: false, dotfiles: 'ignore', maxAge: '5 days'};
      break;
    default:
      redisConfig = BIBLO_CONFIG.sessionStores.redis.local; // eslint-disable-line no-process-env
      break;
  }

  // Configure message queue
  const userMessageQueue = Queue('user messages', redisConfig.port, redisConfig.host);
  userMessageQueue.process((job, done) => {
    job.app = app;
    return processUserMessage(job, done);
  });

  // Configure user status queue
  const userStatusCheckQueue = Queue('user status check', redisConfig.port, redisConfig.host);
  userStatusCheckQueue.process((job, done) => {
    job.app = app;
    return processUserStatusCheck(job, done);
  });

  // Set queues to app
  app.set('userMessageQueue', userMessageQueue);
  app.set('userStatusCheckQueue', userStatusCheckQueue);

  const redisStore = RedisStore(expressSession);

  const redisInstance = new redisStore({
    host: redisConfig.host,
    port: redisConfig.port,
    prefix: APP_NAME + '_session_'
  });

  redisInstance.client.on('error', function () {
    logger.log('debug', 'ERROR: Redis server not found! No session storage available.');
  });

  const sessionMiddleware = expressSession({
    store: redisInstance,
    secret: redisConfig.secret + APP_NAME,
    name: APP_NAME,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: PRODUCTION,

      // Expire the cookie at end of browser session (same behavior as uni-login).
      expires: null,
      maxAge: null
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
  PassportStrategies.Unilogin(app, BIBLO_CONFIG.unilogin);

  // Setting middleware
  app.use(GlobalsMiddleware); // should be placed after PassportStrategies.MobilSoegPassportConfig
  app.use(ssrMiddleware);
  app.use(ensureProfileImage);

  app.use('/anmeldelse', ReviewRoutes, ensureUserHasValidLibrary);
  app.use('/grupper', ensureUserHasProfile, ensureUserHasValidLibrary, GroupRoutes);
  app.use('/find', SearchRoutes, ensureUserHasValidLibrary);
  app.use('/profil', ProfileRoutes);
  app.use('/kampagne', CampaignRoutes);
  app.use('/materiale', WorkRoutes, ensureUserHasValidLibrary);
  app.use('/indhold', ContentRoutes, ensureUserHasValidLibrary);
  app.use('/api', ApiRoutes);
  app.use('/', MainRoutes);

  // middleware like route to catch all non-caught routes.
  app.use(wildCardRoute);

  // Graceful handling of errors
  app.use((err, req, res, next) => {
    logger.log('error', 'An error occurred! Got following: ' + err);
    console.error('error', 'An error occurred! Got following: ' + err.stack); // eslint-disable-line no-console
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

  logger.log('debug', '>> Worker PID: ' + process.pid);
  logger.log('debug', 'Server listening on port ' + app.get('port'));
  logger.log('debug', 'NEW_RELIC_APP_NAME: ' + APP_NAME);
  logger.log('debug', 'APPLICATION: ' + APPLICATION);
  logger.log('debug', 'EMAIL_REDIRECT: ' + EMAIL_REDIRECT);
};
