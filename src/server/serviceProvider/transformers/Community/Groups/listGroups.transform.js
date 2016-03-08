'use strict';

const ListGroupsTransform = {
  event() {
    return 'listGroups';
  },

  requestTransform(event, {skip=0}) { // eslint-disable-line no-unused-vars
    console.log("listGroupsTransform skip:", skip);
    return this.callServiceClient('community',
      'listGroups', {
        filter: {
          limit: 15,
          skip:  skip,
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
    const body = JSON.parse(response.body);
    return body;
  }
};

export default ListGroupsTransform;
