'use strict';

/**
 * @file
 * Uses the custom method 'checkIfUserExists' to check whether a user exists.
 */
const createProfile = {

  /**
   * @return {string}
   */
  event() {
    return 'createProfile';
  },

  /**
   * @param {String} event
   * @param {Object} query
   */
  requestTransform(event, query) {
    return this.callServiceClient('community', 'createProfile', {
      username: query || ''
    });
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: response.body, statusCode: response.statusCode, statusMessage: response.statusMessage};
  }
};

export default createProfile;
