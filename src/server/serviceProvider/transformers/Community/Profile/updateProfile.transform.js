'use strict';

const UpdateProfileTransform = {

  event() {
    return 'updateProfile';
  },

  requestTransform(event, profile, connection) {
    const user = connection.request.user || {id: '', profileId: ''};
    const accessToken = user.id;
    const uid = user.profileId;
    return this.callServiceClient('community', 'updateProfile', {uid, profile, accessToken});
  },

  responseTransform(response) {
    return {status: response.statusCode === 200, data: response.body, errors: []};
  }
};

export default UpdateProfileTransform;
