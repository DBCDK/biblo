const LeaveGroupTransform = {

  event() {
    return 'leaveGroup';
  },

  requestTransform(event, {groupId, profileId}, connection) {
    const passport = connection.request.session.passport;
    if (passport) {
      return this.callServiceClient('community', 'leaveGroup', {groupId, uid: passport.user.profileId});
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    if (response.statusCode === 200 || response.statusCode === 204) {
      return {};
    }
    return {error: 'Gruppen kan ikke findes'};
  }
};

export default LeaveGroupTransform;
