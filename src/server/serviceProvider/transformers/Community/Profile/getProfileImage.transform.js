'use strict';

/**
 * @file
 * Get the user profile + profile image.
 */
const getProfileImageTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getProfileImage';
  },

  /**
   *
   * @param event
   * @param id
   * @returns {Promise}
   */
  requestTransform(event, id) {
    return this.callServiceClient('community', 'getProfileImage', {id});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: JSON.parse(response.body), statusCode: 200, statusMessage: 'OK'};
  }
};

export default getProfileImageTransform;
