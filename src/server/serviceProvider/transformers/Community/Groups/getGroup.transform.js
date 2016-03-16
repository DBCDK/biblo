'use strict';

import * as _ from 'lodash';
import parseProfile from '../../../parsers/profile.parser';

const GetGroupTransform = {

  event() {
    return 'getGroup';
  },

  parseGroup(group) {
    group.owner = parseProfile(group.owner, true, 'small');
    group.image = group.coverImage && '/billede/' + group.coverImage.id + '/medium' || null;
    return group;
  },

  requestTransform(event, {id, allMembers}, connection) { // eslint-disable-line no-unused-vars

    let memberLimit = (typeof allMembers !== 'undefined' && allMembers) ? 1000 : 15;

    const groupFilter = {
      counts: 'posts',
      include: [
        {
          relation: 'members',
          scope: {
            limit: memberLimit,
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

    return this.callServiceClient('community', 'getGroup', {id, filter: groupFilter});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars

    const uid = connection.request.session.passport && connection.request.session.passport.user && connection.request.session.passport.user.profileId || null;

    const loggedIn = typeof uid !== 'undefined';
    const body = this.parseGroup(JSON.parse(response.body));

    if (loggedIn) {
      // is the current user following the group?
      body.isFollowing = _.filter(body.members, (member) => uid === member.id).length !== 0;
      // get some members who aren't owners
      body.members = (_.filter(body.members, (member) => member.id !== body.owner.id)).map((member) => {
        return parseProfile(member, true, 'small');
      });
    }

    return body;
  }
};

export default GetGroupTransform;
