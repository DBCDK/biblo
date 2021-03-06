/**
 * @file: This file contains middlewares for appending and updating data for endpoints.
 */

import {log} from 'dbc-node-logger';
import {config} from '@dbcdk/biblo-config';

import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';

import {wrapComponentInProvider} from '../../client/App';
import rootReducer from '../../client/Reducers/root.reducer';

import getGlobalContent from '../utils/globalContent.util';

/**
 * Sets the config object to a prop on the request object.
 * @param {Object}req
 * @param {Object}res
 * @param {Function}next
 */
export function ConfigurationMiddleware(req, res, next) {
  req.config = config;
  next();
}

/**
 * Middleware to set a users full profile (always refreshed) on the session, ready for use.
 * !!! This middleware requires the ssrMiddleware from serviceprovider.middleware.js !!!
 *
 * @param req
 * @param res
 * @param next
 */
export function fullProfileOnSession(req, res, next) {
  // eslint-disable-line consistent-return
  if (!req.isAuthenticated()) {
    res.locals.profile = JSON.stringify({
      profile: {
        userIsLoggedIn: false
      }
    });

    return next();
  }

  let beforeProfile = req.session.passport.user.profile.profile || req.session.passport.user.profile;

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

  req
    .callServiceProvider('getFullProfile')
    .then(result => {
      if (result && result[0] && result[0].body && result[0].statusCode === 200) {
        req.session.passport.user.profile = {
          profile: Object.assign(result[0].body, {userIsLoggedIn: true}),
          errors: []
        };
      }

      if (
        beforeProfile &&
        beforeProfile.favoriteLibrary &&
        beforeProfile.favoriteLibrary.libraryIsInvalid &&
        beforeProfile.favoriteLibrary.libraryId === req.session.passport.user.profile.profile.favoriteLibrary.libraryId
      ) {
        req.session.passport.user.profile.profile.favoriteLibrary.libraryIsInvalid = true;
      }

      res.locals.profile = JSON.stringify(req.session.passport.user.profile);
      next();
    })
    .catch(err => {
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
    shouldDisplay: false,
    url: '',
    unreadMessages: 0
  };

  if (req.isAuthenticated()) {
    new Promise(resolve => {
      if (req.session.passport.user && req.session.passport.user.profile && req.session.passport.user.profile.profile) {
        resolve(req.session.passport.user.profile.profile);
      } else {
        fullProfileOnSession(req, res, () => {
          resolve(req.session.passport.user.profile.profile);
        });
      }
    })
      .then(profile => {
        if (profile.image && profile.image.url && profile.image.url.small && profile.image.url.small.length > 0) {
          image.url = req.session.passport.user.profile.profile.image.url.small;
          image.shouldDisplay = true;

          if (profile.userMessages && profile.userMessages.unreadMessages) {
            image.unreadMessages = profile.userMessages.unreadMessages;
          }
        }

        res.locals.profileImage = JSON.stringify(image);
        next();
      })
      .catch(() => {
        res.locals.profileImage = JSON.stringify(image);
        next();
      });
  } else {
    res.locals.profileImage = JSON.stringify(image);
    next();
  }
}

/**
 * This is a middleware to get the initial redux state and set it to the req object for easier SSR.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function reduxStateMiddleware(req, res, next) {
  // Get initial state from root reducer
  let init = createStore(rootReducer).getState();

  try {
    const profileReducer = req.session.passport.user.profile.profile;
    req.initialReduxState = Object.assign(
      init,
      {profileReducer} // Overwrite profile state with actual profile.
    );
  } catch (e) {
    req.initialReduxState = init;
  }

  /**
   * Helper function, overwrites a prop in the statetree
   * @param {String} prop
   * @param {PlainObject} value
   */
  req.writeToReduxStateTree = (prop, value) => {
    let newState = {};
    newState[prop] = Object.assign({}, req.initialReduxState[prop], value);
    req.initialReduxState = Object.assign({}, req.initialReduxState, newState);
    return req.initialReduxState;
  };

  next();
}

export function renderComponent(req, res, next) {
  req.renderComponent = (Component, stateKeyName = 'state', contentKeyName = 'content') => {
    const wrapper = wrapComponentInProvider(Component, req.initialReduxState);
    res.locals[stateKeyName] = JSON.stringify(wrapper.state);
    res.locals[contentKeyName] = renderToString(wrapper.component);
  };

  next();
}

/**
 * Get global content from admin system.
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
export async function GetMenus(req, res, next) {
  try {
    await getGlobalContent(req, globalContent => {
      req.writeToReduxStateTree('globalReducer', globalContent);
      res.locals.globalContent = JSON.stringify({globalContent});
    });
  } catch (e) {
    log.error('Retrieval of global content failed', e);
  }

  next();
}
