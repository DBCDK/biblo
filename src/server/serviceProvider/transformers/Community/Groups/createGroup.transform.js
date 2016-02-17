'use strict';

const CreateGroupTransform = {
  event() {
    return 'createGroup';
  },

  requestTransform(event, query, connection) {
    if (connection.request.session.passport) {
      // If user is logged in create the post
      const passport = connection.request.session.passport;
      return this.callServiceClient('community', 'createGroup', {
        name: query.name,
        description: query.description,
        colour: query.colour,
        coverImage: query.group_image,
        uid: passport.user.profileId,
        accessToken: passport.user.id
      });
    }

    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: []};
  }
};

export default CreateGroupTransform;
