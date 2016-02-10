'use strict';

/**
 * @file
 * Uses the custom method 'checkIfUserExists' to check whether a user exists.
 */
const loginViaUnilogin = {

  /**
   * @return {string}
   */
  event() {
    return 'loginViaUnilogin';
  },

  /**
   *
   * @param event
   * @param username
   * @param timestamp
   * @param authtoken
   * @param ttl
   * @returns {Promise}
   */
  requestTransform(event, {username, timestamp, authtoken, ttl}) {
    return this.callServiceClient('community', 'loginAndGetProfile', {
      username,
      timestamp,
      authtoken,
      ttl
    });
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: JSON.parse(response.body), statusCode: response.statusCode, statusMessage: response.statusMessage};
  }
};

export default loginViaUnilogin;
