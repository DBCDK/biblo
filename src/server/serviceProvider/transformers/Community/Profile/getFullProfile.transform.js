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

    if (body.image) {
      body.image.url = {
        small: '/billede/' + body.image.id + '/small',
        medium: '/billede/' + body.image.id + '/medium',
        large: '/billede/' + body.image.id + '/large'
      };
    }
    else {
      body.image = {
        url: {
          small: '/no_profile.png',
          medium: '/no_profile.png',
          large: '/no_profile.png'
        }
      };
    }

    return {body: body, statusCode: response.statusCode, statusMessage: response.statusMessage};
  }
};

export default getFullProfileTransform;
