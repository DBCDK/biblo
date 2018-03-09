/**
 * @file
 * This file contains the various strategies used by PassportJS in PG and MobilSøg
 */
import passport from 'passport';
import {log} from 'dbc-node-logger';

// Strategies
import UniloginStrategy from 'passport-unilogin';

export function Unilogin(app, uniloginConfig) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new UniloginStrategy(
    {
      id: uniloginConfig.id,
      secret: uniloginConfig.secret,
      uniloginBasePath: uniloginConfig.uniloginBasePath,
      maxTicketAge: 30
    }, (error, req, ticket, done) => { // eslint-disable-line consistent-return

      if (error && error.auth.error) {
        req.session.passportError = {
          message: error.auth.error
        };

        log.warn('Error when comparing auth\'s in ticket from UNI-Loing', {
          error: error,
          query: req.query,
          ticket: ticket,
          sessionId: req.sessionID
        });
        return done(null, false, error.auth.message);
      }

      if (error && error.timestamp.error) {
        req.session.passportError = {
          message: error.timestamp.message
        };

        log.warn('Error when validating timestamps in ticket from UNI-Loing', {
          error: error,
          query: req.query,
          ticket: ticket,
          sessionId: req.sessionID
        });

        return done(null, false, error.timestamp.message);
      }

      const serviceProvider = app.get('serviceProvider');
      serviceProvider.trigger('checkProfileName', ticket.user)[0].then((res) => {
        // Check if user exists
        if (!res.data.exists) {
          // user doesn't exist, create user
          log.info('User was not found, creating profile', {ticket: ticket, sessionId: req.sessionID});
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
        // We now check if a users library, to ensure it exists
        if (res.body.profile && res.body.profile.favoriteLibrary && res.body.profile.favoriteLibrary.libraryId) {
          if (res.body.profile.favoriteLibrary.loanerId && res.body.profile.favoriteLibrary.pincode) {
            // Now that we have a user, and they're logged in, we can check user status
            app.get('userStatusCheckQueue').add({
              favoriteLibrary: res.body.profile.favoriteLibrary,
              userId: res.body.profile.id
            });
          }

          return new Promise((resolveTemp1) => {
            serviceProvider.trigger('pickupAgencyList', {agencyId: res.body.profile.favoriteLibrary.libraryId})[0].then((libraryRes) => {
              if (libraryRes.error && libraryRes.error === 'no_agencies_found') {
                res.body.profile.favoriteLibrary.libraryIsInvalid = true;
              }

              resolveTemp1(res);
            }).catch((err) => {
              log.error('an error occurred when getting pickupAgencListDetails', {
                error: err.message, sessionId: req.sessionID
              });
              resolveTemp1(res);
            });
          });
        }

        return res;
      }).then((res) => {
        log.info('User was successfully logged in', {ticket: ticket, user: res});
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
