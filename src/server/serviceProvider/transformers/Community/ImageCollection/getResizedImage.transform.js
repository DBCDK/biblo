'use strict';

/**
 * @file
 * Get the user profile + profile image.
 */
const getResizedImageTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getResizedImage';
  },

  /**
   *
   * @param {string} event
   * @param {int} id
   * @param {string} size
   * @returns {Promise}
   */
  requestTransform(event, {id, size}) {
    return this.callServiceClient('community', 'getResizedImage', {id, size});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: JSON.parse(response.body), statusCode: 200, statusMessage: 'OK'};
  }
};

export default getResizedImageTransform;
