import {quarantinedMiddleware} from '../middlewares/auth.middlewares';

const UpdateGroupTransform = {
  event() {
    return 'updateGroup';
  },

  requestTransform(event, query, connection) {
    if (connection.request.session.passport) {
      // If user is logged in create the post
      const passport = connection.request.session.passport;
      return quarantinedMiddleware(this, passport.user.profileId, () => {
        return this.callServiceClient('community', 'updateGroup', {
          groupId: query.id,
          name: query.name,
          description: query.description,
          colour: query.colour,
          coverImage: query.group_image,
          uid: passport.user.profileId,
          accessToken: passport.user.id,
          isModerator: passport.user.profile.profile.isModerator
        });
      });
    }

    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {status: 200, data: response, errors: response.errors || []};
  }
};

export default UpdateGroupTransform;
