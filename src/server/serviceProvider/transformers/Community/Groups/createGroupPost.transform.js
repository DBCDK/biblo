'use strict';

const CreateGroupPost = {
  event() {
    return 'createGroupPost';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars

    if (connection.request.session.passport) {
      // If user is logged in create the post
      const passport = connection.request.session.passport;
      return this.callServiceClient('community', 'createGroupPost', {
        title: query.title,
        content: query.content,
        groupId: query.groupId,
        uid: passport.user.profileId,
        postownerid: passport.user.profileId,
        accessToken: passport.user.id
      }).then((response) => {
        if (response.statusCode === 200 && query.image) {
          const user = connection.request.user || {id: '', profileId: ''};
          const accessToken = user.id;
          const relationId = response.body.id;
          return this.callServiceClient('community', 'updateImage', {relationId, image: query.image, accessToken, relationType: 'Posts'});
        }
        return response;
      });
    }

    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    // @todo handle errors
    const isSuccesful = response.statusCode === 200;
    return JSON.parse(isSuccesful);
  }
};

export default CreateGroupPost;
