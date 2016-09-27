import groupParser from '../../../parsers/group.parser';

const ListGroupsTransform = {
  event() {
    return 'listGroups';
  },

  requestTransform(event, {skip=0, limit=15, order='id DESC'}) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community',
      'listGroups', {
        filter: {
          limit: limit,
          skip: skip,
          order,
          counts: 'members',
          include: [{
            relation: 'coverImage'
          }]
        }
      }
    );
  },

  responseTransform(response) {
    if (!response) {
      throw new Error('Empty response from BibloCS, it\'s most likely down!');
    }

    let body = JSON.parse(response.body);
    body = body.map(groupParser);
    return body;
  }
};

export default ListGroupsTransform;
