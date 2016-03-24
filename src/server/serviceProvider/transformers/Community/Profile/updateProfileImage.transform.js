'use strict';

const UpdateProfileImageTransform = {

  event() {
    return 'updateProfileImage';
  },

  requestTransform(event, {file, uid, isModerator}, connection) {
    const user = connection.request.user || {id: '', profileId: ''};
    const accessToken = user.id;
    uid = isModerator ? uid : user.profileId;
    return this.callServiceClient('community', 'updateImage', {
      relationId: uid,
      relationType: 'profileImageCollection',
      image: file,
      accessToken
    });
  },

  responseTransform(response) {
    return {status: response.statusCode === 200, data: response.body, errors: []};
  }
};

export default UpdateProfileImageTransform;
