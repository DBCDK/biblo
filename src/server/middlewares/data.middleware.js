'use strict';

/**
 * @file: This file contains middlewares for appending and updating data for endpoints.
 */

/**
 * Middleware to set a users full profile (always refreshed) on the session, ready for use.
 * !!! This middleware requires the ssrMiddleware from serviceprovider.middleware.js !!!
 *
 * @param req
 * @param res
 * @param next
 */
export function fullProfileOnSession(req, res, next) {
  req.callServiceProvider('getFullProfile').then((result) => {
    if (result && result[0] && result[0].statusMessage === 'OK') {
      req.session.passport.user.profile = result[0].body;
    }

    next();
  }).catch((err) => {
    console.error(err);
    next();
  });
}
