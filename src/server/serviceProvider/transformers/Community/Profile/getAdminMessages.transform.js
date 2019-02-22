/**
 * @file
 * Get the user profile + profile image.
 */

const getAdminMessagesTransform = {
  /*
  /**
   * @return {string}
   */
  event() {
    return 'getAdminMessages';
  },

  /**
   *
   * @param event
   * @param {Number} uid
   * @param connection
   * @returns {Promise}
   */
  requestTransform(event, {uid}, connection) {
    if (!uid && !connection) {
      return Promise.reject('uid and connection er not set in getAdminMessages!');
    }

    if (!uid) {
      const user = connection.request.user;
      uid = user.profileId;
    }

    return this.callServiceClient('community', 'getAdminMessages', {uid});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: JSON.parse(response.body), statusCode: response.statusCode};
  }
};

export default getAdminMessagesTransform;
