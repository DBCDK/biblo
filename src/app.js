'use strict';

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

// Routes
import MainRoutes from './server/routes/main.routes.js';
import GroupRoutes from './server/routes/group.routes';
import ProfileRoutes from './server/routes/profile.routes';
import ContentRoutes from './server/routes/content.routes';

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
import {ensureUserHasProfile} from './server/middlewares/auth.middleware';

module.exports.run = function(worker) {
  // Setup
  const BIBLO_CONFIG = config.biblo.getConfig({});
  const app = express();
  const server = worker.httpServer;
  const scServer = worker.getSCServer();
  const ENV = app.get('env');
  const PRODUCTION = ENV === 'production';
  const APP_NAME = process.env.NEW_RELIC_APP_NAME || 'biblo'; // eslint-disable-line no-process-env
  const APPLICATION = 'biblo';
  const logger = new Logger({app_name: APP_NAME});
  const expressLoggers = logger.getExpressLoggers();

  // Direct requests to app
  server.on('request', app);

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
  // TODO: Setup rest of Helmet, in a way that works with the server setup.
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy({setTo: 'Funkys Venner!'}));
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
        agent: ProxyAgent(process.env.http_proxy) // eslint-disable-line no-process-env
      }
    });
  }

  // Configure app variables
  app.set('serviceProvider', ServiceProviderSetup(BIBLO_CONFIG, logger, worker));
  app.set('logger', logger);
  app.set('EMAIL_REDIRECT', EMAIL_REDIRECT);
  app.set('APPLICATION', APPLICATION);
  app.set('Configuration', config);
  app.set('amazonConfig', amazonConfig);
  app.set('s3', new AWS.S3());

  // Configure templating
  app.set('views', path.join(__dirname, 'server/templates'));
  app.set('view engine', 'jade');

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

  const redisStore = RedisStore(expressSession);

  const redisInstance = new redisStore({
    host: redisConfig.host,
    port: redisConfig.port,
    prefix: APP_NAME + '_session_'
  });

  redisInstance.client.on('error', function() {
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
      secure: PRODUCTION
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
  app.use('*', GlobalsMiddleware); // should be placed after PassportStrategies.MobilSoegPassportConfig
  app.use(ssrMiddleware);
  app.use(ensureProfileImage);

  app.use('/grupper', ensureUserHasProfile, GroupRoutes);
  app.use('/profil', ProfileRoutes);
  app.use('/indhold', ContentRoutes);
  app.use('/', MainRoutes);

  // Graceful handling of errors
  app.use((err, req, res, next) => {
    logger.log('error', 'An error occurred! Got following: ' + err);
    console.error('error', 'An error occurred! Got following: ' + err); // eslint-disable-line no-console
    if (res.headersSent) {
      return next(err);
    }

    res.status(500);
    res.render('error', {errorImage: 'https://http.cat/500'});
  });

  // Handle 404's
  app.use((req, res) => {
    res.status(404);
    res.render('error', {errorImage: 'https://http.cat/404'});
  });

  // Setting logger -- should be placed after routes
  app.use(expressLoggers.errorLogger);

  logger.log('debug', '>> Worker PID: ' + process.pid);
  logger.log('debug', 'Server listening on port ' + app.get('port'));
  logger.log('debug', 'NEW_RELIC_APP_NAME: ' + APP_NAME);
  logger.log('debug', 'APPLICATION: ' + APPLICATION);
  logger.log('debug', 'EMAIL_REDIRECT: ' + EMAIL_REDIRECT);

  /*eslint-disable */
  if (!PRODUCTION && process.env.ENABLE_HEAP_DUMPS) {
    var heapdump = require('heapdump');
    var oneMb = Math.pow(2, 20);
    var threshold = 10 * oneMb;
    var last = get();
    setInterval(check, 1000);
    function get() {
      return process.memoryUsage().rss;
    }

    function check() {
      var now = get();
      console.log('Memory: %d MB', Math.floor(now / oneMb));
      if (now - last < threshold) {
        return;
      }

      heapdump.writeSnapshot();
      console.log('Memory increase from %d MB to %d MB. Wrote dump',
        Math.floor(last / oneMb),
        Math.floor(now / oneMb));
      last = now;
    }
  }
  /*eslint-enable */
};
