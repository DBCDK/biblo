'use strict';

import groupParser from '../../../parsers/group.parser';

const ListGroupsTransform = {
  event() {
    return 'listGroups';
  },

  requestTransform(event, {skip=0, limit=15}) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community',
      'listGroups', {
        filter: {
          limit: limit,
          skip: skip,
          order: 'timeCreated DESC',
          counts: 'members',
          include: [{
            relation: 'coverImage'
          }]
        }
      }
    );
  },

  responseTransform(response) {
    let body = JSON.parse(response.body);
    body = body.map(groupParser);
    return body;
  }
};

export default ListGroupsTransform;
