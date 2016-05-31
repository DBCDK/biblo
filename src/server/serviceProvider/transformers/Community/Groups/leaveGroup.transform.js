const LeaveGroupTransform = {

  event() {
    return 'leaveGroup';
  },

  requestTransform(event, {groupId, profileId}) {
    return this.callServiceClient('community', 'leaveGroup', {groupId, uid: profileId});
  },

  responseTransform(response) {
    if (response.statusCode === 200 || response.statusCode === 204) {
      return {};
    }
    return {error: 'Gruppen kan ikke findes'};
  }
};

export default LeaveGroupTransform;
