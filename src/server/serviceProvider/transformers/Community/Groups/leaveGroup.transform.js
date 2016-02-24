'use strict';

const LeaveGroupTransform = {

  event() {
    return 'leaveGroup';
  },

  requestTransform(event, {groupId, profileId}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community', 'leaveGroup', {groupId, uid: profileId});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode === 200) {
      return {};
    }
    return {error: 'Gruppen kan ikke findes'};
  }
};

export default LeaveGroupTransform;
