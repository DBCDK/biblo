'use strict';

const LikePostTransform = {

  event() {
    return 'likePost';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    // TODO:check user is logged in

    console.log('request transform',query);
    const profileId = query.profileId;
    const postId = query.postId;

    return this.callServiceClient('community', 'likePost', {profileId, postId});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    console.log(response.statusCode);

    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method likePost failed');
    }

    // TODO: return response in correct format
    return JSON.parse(response.body);
  }
};

export default LikePostTransform;
