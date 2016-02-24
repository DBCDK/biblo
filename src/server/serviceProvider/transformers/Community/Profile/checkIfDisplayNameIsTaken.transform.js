'use strict';

/**
 * @file
 * Uses the custom method 'checkIfUserExists' to check whether a user exists.
 */
const checkIfDisplayNameIsTaken = {

  /**
   * @return {string}
   */
  event() {
    return 'checkIfDisplayNameIsTaken';
  },

  /**
   * @param {String} event
   * @param {Object} query
   */
  requestTransform(event, query) {
    return this.callServiceClient('community', 'checkIfDisplayNameIsTaken', {
      displayname: query || ''
    });
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {status: response.statusCode, data: JSON.parse(response.body), errors: []};
  }
};

export default checkIfDisplayNameIsTaken;
