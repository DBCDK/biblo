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
  req.session.passport.user.profile = {
    profile: {
      username: '',
      displayName: '',
      favoriteLibrary: {
        libraryId: ''
      },
      description: '',
      email: '',
      phone: '',
      created: '',
      lastUpdated: '',
      hasFilledInProfile: false,
      id: -1,
      image: {
        url: 'http://www.insite.io/browser/home/accounts/assets/images/no-profile-image.jpg'
      }
    },
    userIsLoggedIn: false,
    errors: []
  };

  req.callServiceProvider('getFullProfile').then((result) => {
    if (result && result[0] && result[0].statusMessage === 'OK') {
      req.session.passport.user.profile = {profile: result[0].body, userIsLoggedIn: true, errors: []};
    }

    res.locals.profile = JSON.stringify(req.session.passport.user.profile);
    next();
  }).catch((err) => {
    req.session.passport.user.profile.errors.push(err);
    res.locals.profile = JSON.stringify(req.session.passport.user.profile);
    next();
  });
}
