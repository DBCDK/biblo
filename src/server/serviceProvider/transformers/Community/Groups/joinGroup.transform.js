const JoinGroupTransform = {

  event() {
    return 'joinGroup';
  },

  requestTransform(event, {groupId, profileId}) {
    return this.callServiceClient('community', 'joinGroup', {groupId, uid: profileId});
  },

  responseTransform(response) {
    if (response.statusCode === 200) {
      return {};
    }
    return {error: 'Gruppen kan ikke findes'};
  }
};

export default JoinGroupTransform;
