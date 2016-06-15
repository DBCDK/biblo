/**
 * @file
 * Gets a users quarantines.
 */

const getQuarantinesTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getQuarantines';
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
      return Promise.reject('uid and connection er not set in getQuarantines!');
    }

    if (!uid) {
      const user = connection.request.user;
      uid = user.profileId;
    }

    const filter = {
      where: {
        end: {
          gte: (new Date()).toISOString()
        }
      }
    };

    return this.callServiceClient('community', 'getUserQuarantines', {uid, filter});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: JSON.parse(response.body), statusCode: response.statusCode};
  }
};

export default getQuarantinesTransform;
