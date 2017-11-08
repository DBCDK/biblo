/**
 * @file: This transform gets a group from the community service, if a user is logged in, it also checks if that user is following the group.
 */

import groupParser from '../../../parsers/group.parser';

const GetGroupTransform = {

  event() {
    return 'getGroup';
  },

  requestTransform(event, {id}, connection) {
    const uid = connection.request.session.passport && connection.request.session.passport.user && connection.request.session.passport.user.profileId || null;
    let promises = [];
    let groupFilter = {
      counts: ['posts', 'members'],
      include: [
        {
          relation: 'owner',
          scope: {
            include: ['image']
          }
        },
        {
          relation: 'coverImage'
        }
      ]
    };

    promises.push(this.callServiceClient('cached/standard/community', 'getGroup', {id, filter: groupFilter}));

    if (uid) {
      promises.push(this.callServiceClient('community', 'checkForMemberInGroup', {groupId: id, profileId: uid}));
    }

    return Promise.all(promises);
  },

  responseTransform(response) {
    let body = groupParser(JSON.parse(response[0].body));
    body.isFollowing = response[1] && response[1].statusCode && response[1].statusCode !== 404 || false; // If the status code is 404, the user is not following the group
    body.members = [];

    return body;
  }
};

export default GetGroupTransform;
