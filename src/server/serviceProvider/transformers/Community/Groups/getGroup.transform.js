import * as _ from 'lodash';
import parseProfile from '../../../parsers/profile.parser';
import groupParser from '../../../parsers/group.parser';

const GetGroupTransform = {

  event() {
    return 'getGroup';
  },

  requestTransform(event, {id, allMembers, membersLimit = 15}, connection) {
    const uid = connection.request.session.passport && connection.request.session.passport.user && connection.request.session.passport.user.profileId || null;
    let promises = [];
    let groupFilter = {
      counts: ['posts', 'members'],
      include: [
        {
          relation: 'members',
          scope: {
            order: 'id DESC',
            include: ['image']
          }
        },
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

    if (!allMembers) {
      groupFilter.include[0].scope.limit = membersLimit;
    }

    promises.push(this.callServiceClient('community', 'getGroup', {id, filter: groupFilter}));

    if (uid) {
      promises.push(this.callServiceClient('community', 'checkForMemberInGroup', {groupId: id, profileId: uid}));
    }

    return Promise.all(promises);
  },

  responseTransform(response, query, connection) {
    let body = groupParser(JSON.parse(response[0].body));
    body.isFollowing = response[1] && response[1].statusCode && response[1].statusCode !== 404 || false;
    body.members = (_.filter(body.members, (member) => member.id !== body.owner.id)).map((member) => {
      return parseProfile(member, true, 'small');
    });

    return body;
  }
};

export default GetGroupTransform;
