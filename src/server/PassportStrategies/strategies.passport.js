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
    }, (error, req, ticket, done) => { // eslint-disable-line consistent-return

      if (error && error.auth.error) {
        req.session.passportError = {
          message: error.auth.error
        };
        logger.warning('Error when comparing auth\'s in ticket from UNI-Loing', {
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
        logger.warning('Error when validating timestamps in ticket from UNI-Loing', {
          error: error,
          query: req.query,
          ticket: ticket
        });
        return done(null, false, error.timestamp.message);
      }

      const serviceProvider = app.get('serviceProvider');
      serviceProvider.trigger('checkProfileName', ticket.user)[0].then((res) => {
        // Check if user exists
        if (!res.data.exists) {
          // user doesn't exist, create user
          logger.info('User was not found, creating profile', {ticket: ticket});
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
        // Now that we have a user, and they're logged in, we can check user status
        app.get('userStatusCheckQueue').add({favoriteLibrary: res.body.profile.favoriteLibrary, userId: res.body.profile.id});

        // We now check if a users library, to ensure it exists
        if (res.body.profile && res.body.profile.favoriteLibrary && res.body.profile.favoriteLibrary.libraryId) {
          return new Promise((resolveTemp1) => {
            serviceProvider.trigger('pickupAgencyList', {agencyId: res.body.profile.favoriteLibrary.libraryId})[0].then((libraryRes) => {
              if (libraryRes.error && libraryRes.error === 'no_agencies_found') {
                res.body.profile.favoriteLibrary.libraryIsInvalid = true;
              }

              resolveTemp1(res);
            }).catch((err) => {
              logger.error('an error occurred when getting pickupAgencListDetails', {error: err.message});
              resolveTemp1(res);
            });
          });
        }

        return res;
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
