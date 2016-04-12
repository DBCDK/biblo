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
export function fullProfileOnSession(req, res, next) { // eslint-disable-line consistent-return
  if (!req.isAuthenticated()) {
    res.locals.profile = JSON.stringify({
      profile: {
        userIsLoggedIn: false
      }
    });
    return next();
  }

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
        url: {}
      }
    },
    errors: []
  };

  req.callServiceProvider('getFullProfile').then((result) => {
    if (result && result[0] && result[0].statusMessage === 'OK') {
      req.session.passport.user.profile = {profile: Object.assign(result[0].body, {userIsLoggedIn: true}), errors: []};
    }

    res.locals.profile = JSON.stringify(req.session.passport.user.profile);
    next();
  }).catch((err) => {
    req.session.passport.user.profile.errors.push(err);
    res.locals.profile = JSON.stringify(req.session.passport.user.profile);
    next();
  });
}

/**
 * This middleware checks if a user is logged in, if they are, it tries to set the users profile image to a local.
 * @param req
 * @param res
 * @param next
 */
export function ensureProfileImage(req, res, next) {
  let image = {
    shouldDisplay: false
  };

  if (req.isAuthenticated()) {
    (new Promise((resolve) => {
      if (
        req.session.passport.user &&
        req.session.passport.user.profile &&
        req.session.passport.user.profile.profile
      ) {
        resolve(req.session.passport.user.profile.profile);
      }
      else {
        fullProfileOnSession(req, res, () => {
          resolve(req.session.passport.user.profile.profile);
        });
      }
    })).then((profile) => {
      if (
        profile.image &&
        profile.image.url &&
        profile.image.url.small &&
        profile.image.url.small.length > 0
      ) {
        image.url = req.session.passport.user.profile.profile.image.url.small;
        image.shouldDisplay = true;
      }

      res.locals.profileImage = JSON.stringify(image);
      next();
    }).catch(() => {
      res.locals.profileImage = JSON.stringify(image);
      next();
    });
  }
  else {
    res.locals.profileImage = JSON.stringify(image);
    next();
  }
}
