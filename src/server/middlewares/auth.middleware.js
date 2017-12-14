/**
 * @file: This file contains middlewares for authentication and the like.
 */

/**
 * Middleware to redirect a person back to where they came once logged in.
 *
 * @param req
 * @param res
 * @param next
 * @returns *
 */
export function redirectBackToOrigin(req, res, next) {
  if (req.session.returnUrl) {
    let ret = req.session.returnUrl;
    delete req.session.returnUrl;
    return res.redirect(ret);
  }

  return next();
}

/**
 * Middleware to make sure a user is authenticated.
 *
 * @param req
 * @param res
 * @param next
 * @returns null
 */
export function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnUrl = req.originalUrl;
    return res.redirect('/login');
  }

  return next();
}

export function setReferer(req, res, next) {
  if (req.query.destination) {
    req.session.returnUrl = req.query.destination || '/';
    delete req.query.destination;
  }

  return next();
}

/**
 * Middleware to make sure a user has filled in their profile,
 * only checks logged in users, so best to use it with ensureAuthenticated.
 *
 * @param req
 * @param res
 * @param next
 * @returns null
 */
export function ensureUserHasProfile(req, res, next) {
  // User is not authenticated, use ensureAuthenticated if you want *everyone* to have a profile.
  if (!req.isAuthenticated()) {
    return next();
  }

  // user has a profile, send them to where they want to go.
  if (req.user && ((req.user.profile.profile || req.user.profile).hasFilledInProfile)) {
    return next();
  }

  // user does not have a profile
  req.session.returnUrl = req.originalUrl;
  return res.redirect('/profil/rediger');
}

export function ensureUserHasValidLibrary(req, res, next) {
  if (req.isUnauthenticated()) {
    return next();
  }

  const profile = req.user && (req.user.profile.profile || req.user.profile);

  if (profile && profile.favoriteLibrary && profile.favoriteLibrary.libraryIsInvalid) {
    req.session.returnUrl = req.originalUrl;
    return res.redirect('/profil/rediger/bibliotek');
  }

  return next();
}
