/**
 * @file: This transform checks if a profile is a member of a group.
 */

const checkForMemberInGroupTransform = {

  event() {
    return 'checkForMemberInGroup';
  },

  requestTransform(event, {id}, connection) {
    const uid = connection.request.session.passport && connection.request.session.passport.user && connection.request.session.passport.user.profileId || null;
    if (uid) {
      return this.callServiceClient('community', 'checkForMemberInGroup', {groupId: id, profileId: uid});
    }

    return Promise.resolve({statusCode: 404});
  },

  responseTransform(response) {
    return response && response.statusCode && response.statusCode !== 404 || false; // If the status code is 404, the user is not following the group
  }
};

export default checkForMemberInGroupTransform;
