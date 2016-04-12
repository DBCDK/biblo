import {quarantinedMiddleware} from '../middlewares/auth.middlewares';

const UpdateProfileTransform = {

  event() {
    return 'updateProfile';
  },

  requestTransform(event, profile, connection) {
    const user = connection.request.user || {id: '', profileId: ''};
    const accessToken = user.id;
    const uid = profile.isModerator && profile.uid || user.profileId;
    return quarantinedMiddleware(this, user.profileId, () => {
      profile.isModerator && delete profile.isModerator; // eslint-disable-line no-unused-expressions
      profile.uid && delete profile.uid; // eslint-disable-line no-unused-expressions

      return this.callServiceClient('community', 'updateProfile', {uid, profile, accessToken});
    });
  },

  responseTransform(response) {
    return {status: response.statusCode === 200, data: response.body, errors: response.errors || []};
  }
};

export default UpdateProfileTransform;
