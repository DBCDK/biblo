'use strict';

const JoinGroupTransform = {

  event() {
    return 'joinGroup';
  },

  requestTransform(event, {groupId, profileId}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community', 'joinGroup', {groupId, uid: profileId});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode === 200) {
      return {};
    }
    return {error: 'Gruppen kan ikke findes'};
  }
};

export default JoinGroupTransform;
