'use strict';

const CreateGroupContent = {
  event() {
    return 'createGroupContent';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars

    // If user is logged in create the post
    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;
      const method = query.type === 'post' && 'createPost' || 'createComment';
      return this.callServiceClient('community', method, {
        title: query.title,
        content: query.content,
        parentId: query.parentId,
        uid: passport.user.profileId,
        ownerid: passport.user.profileId,
        accessToken: passport.user.id
      }).then((response) => {
        if (response.statusCode === 200 && query.image) {
          const image = query.image;
          query.image = {data: 'Binary Image Data!'};
          const user = connection.request.user || {id: '', profileId: ''};
          const accessToken = user.id;
          const relationId = response.body.id;
          return this.callServiceClient('community', 'updateImage', {
            relationId,
            image,
            accessToken,
            relationType: query.type === 'post' && 'postImageCollection' || 'commentImageCollection'
          });
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

export default CreateGroupContent;
