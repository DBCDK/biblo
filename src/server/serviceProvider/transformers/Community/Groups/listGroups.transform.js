'use strict';

import * as _ from 'lodash';

const ListGroupsTransform = {
  event() {
    return 'listGroups';
  },

  requestTransform(event) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community',
      'listGroups', {
        filter:{
          limit: 15,
          order: 'timeCreated DESC',
          counts: 'members',
          include: [{
           relation: 'coverImage'
          }]
      }}
    );
  },

  responseTransform(response, query, connection) {
    const body = JSON.parse(response.body);
    return body;
  }

};

export default ListGroupsTransform;
