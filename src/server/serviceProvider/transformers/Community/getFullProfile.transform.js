'use strict';

/**
 * @file
 * Get the user profile + profile image.
 */
const getFullProfileTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getFullProfile';
  },

  /**
   *
   * @param event
   * @param query
   * @param connection
   * @returns {Promise}
   */
  requestTransform(event, query, connection) {
    const user = connection.request.user || {id: '', profileId: ''};
    const accessToken = user.id;
    const uid = user.profileId;
    return this.callServiceClient('community', 'getFullProfile', {uid, accessToken});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    let body = JSON.parse(response.body);
    body.image.url = '/profil/billede/' + body.image.id;
    return {body: body, statusCode: response.statusCode, statusMessage: response.statusMessage};
  }
};

export default getFullProfileTransform;
