'use strict';


const ListGroupsTransform = {
  event() {
    return 'listGroups';
  },

  requestTransform(event) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community',
      'listGroups', {
        filter: {
          limit: 15,
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
