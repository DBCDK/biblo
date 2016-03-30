'use strict';

/**
 * @file
 * This file contains the various strategies used by PassportJS in PG and MobilSøg
 */
import passport from 'passport';

// Strategies
import UniloginStrategy from 'passport-unilogin';

export function Unilogin(app, uniloginConfig) {
  const logger = app.get('logger');

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new UniloginStrategy(
    {
      id: uniloginConfig.id,
      secret: uniloginConfig.secret,
      uniloginBasePath: uniloginConfig.uniloginBasePath,
      maxTicketAge: 30
    }, (error, req, ticket, done) => {

      if (error && error.auth.error) {
        req.session.passportError = {
          message: error.auth.error
        };
        logger.warning(`Error when comparing auth's in ticket from UNI-Loing`, {
          error: error,
          query: req.query,
          ticket: ticket
        });
        return done(null, false, error.auth.message);
      }

      if (error && error.timestamp.error) {
        req.session.passportError = {
          message: error.timestamp.message
        };
        logger.warning(`Error when validating timestamps in ticket from UNI-Loing`, {
          error: error,
          query: req.query,
          ticket: ticket
        });
        return done(null, false, error.timestamp.message);
      }

      const serviceProvider = app.get('serviceProvider');
      serviceProvider.trigger('checkProfileName', ticket.user)[0].then((res) => {
        // Check if user exists
        if (res.body && !res.body.exists) {
          // user doesn't exist, create user
          return serviceProvider.trigger('createProfile', ticket.user)[0];
        }
        return {};
      }).then(() => {
        // user now exists, login
        return serviceProvider.trigger('loginViaUnilogin', {
          username: ticket.user,
          timestamp: ticket.timestamp,
          authtoken: ticket.auth,
          ttl: 0 // use default ttl
        })[0];
      }).then((res) => {
        logger.info('User was successfully logged in', {ticket: ticket, user: res});
        done(null, res.body);
      }).catch((err) => {
        done(err);
      });
    }
  ));

  passport.serializeUser((loopbackSession, done) => {
    done(null, loopbackSession);
  });

  passport.deserializeUser((id, done) => {
    done(null, id);
  });
}
