'use strict';

const UnlikePostTransform = {

  event() {
    return 'unlikePost';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    // check user is logged in
    if (connection.request.session.passport) {

      const passport = connection.request.session.passport;
      const profileId = query.profileId;
      const postId = query.postId;
      const accessToken = passport.user.id;
      return this.callServiceClient('community', 'unlikePost', {profileId, postId, accessToken});
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars

    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method likePost failed');
    }

    // TODO: return response in correct format
    return JSON.parse(response.body);
  }
};

export default UnlikePostTransform;
