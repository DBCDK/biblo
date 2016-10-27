import groupParser from '../../../parsers/group.parser';

const ListGroupsTransform = {
  event() {
    return 'popularGroups';
  },

  requestTransform(event, {skip = 0, limit = 15, order = 'group_pop DESC'}) { // eslint-disable-line no-unused-vars
    return Promise.all([
      this.callServiceClient('community', 'listGroups', {
        filter: {
          limit: limit,
          skip: skip,
          order,
          include: [{
            relation: 'coverImage'
          }]
        }
      }),
      this.callServiceClient('community', 'countGroups', {where: {markedAsDeleted: false}})
    ]).catch(err => {
      if (err.message) {
        return err.message;
      }

      return err;
    });
  },

  responseTransform(response) {
    if (response.length < 2) {
      throw new Error('Empty response from BibloCS, it\'s most likely down!');
    }

    const groupsResponse = JSON.parse(response[0].body);
    if (!Array.isArray(groupsResponse)) {
      throw new Error('Popular groups response is not an array!');
    }

    const groupsCountResponse = JSON.parse(response[1].body);
    if (!(groupsCountResponse && groupsCountResponse.count)) {
      throw new Error('Invalid group count in popular groups transform.');
    }

    return {
      groups: groupsResponse.map(groupParser),
      count: groupsCountResponse.count
    };
  }
};

export default ListGroupsTransform;
