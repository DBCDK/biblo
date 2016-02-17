'use strict';

const UpdateProfileImageTransform = {

  event() {
    return 'updateProfileImage';
  },

  requestTransform(event, image, connection) {
    const user = connection.request.user || {id: '', profileId: ''};
    const accessToken = user.id;
    const uid = user.profileId;
    return this.callServiceClient('community', 'updateImage', {
      relationId: uid,
      relationType: 'Profiles',
      image,
      accessToken
    });
  },

  responseTransform(response) {
    return {status: response.statusCode === 200, data: response.body, errors: []};
  }
};

export default UpdateProfileImageTransform;
