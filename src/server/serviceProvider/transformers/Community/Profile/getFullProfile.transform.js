/**
 * @file
 * Get the user profile + profile image.
 */

import {userMessageParser} from '../../../parsers/userMessage.parser';

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
    const uid = query && query.isModerator && query.id || user.profileId;
    return Promise.all([
      this.callServiceClient(
        'community',
        'getFullProfile',
        {
          uid,
          accessToken,
          profileFilter: {
            include: ['image', 'communityRoles']
          }
        }
      ),
      this.callServiceClient('community', 'checkIfProfileIsQuarantined', uid),
      this.callServiceClient('aws', 'getUserMessages', uid)
    ]);
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    let body = JSON.parse(response[0].body);

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

    body.isModerator = !!(body.communityRoles && Array.isArray(body.communityRoles) && body.communityRoles.filter((role) => {
      return role.name === 'moderator';
    }).length > 0);

    body.quarantined = JSON.parse(response[1].body).quarantined;
    body.userMessages = userMessageParser(response[2] && response[2].Items || [], 0);

    return {body: body, statusCode: response[0].statusCode, statusMessage: response[0].statusMessage};
  }
};

export default getFullProfileTransform;
