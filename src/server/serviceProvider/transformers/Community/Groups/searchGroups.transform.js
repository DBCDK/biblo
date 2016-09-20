import groupParser from '../../../parsers/group.parser';

const SearchGroupsTransform = {

  event() {
    return 'searchGroups';
  },

  requestTransform(event, {q, limit=5, from=0}) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community',
      'searchGroups', {
        q: q,
        fields: ['name', 'description'],
        limit: limit,
        from: from
      }
    );
  },

  responseTransform(response) {
    const body = JSON.parse(response.body);
    if (!body || !Array.isArray(body.hits)) {
      throw new Error('Unexpected response from biblocs.');
    }

    return body.hits.map((data) => {
      return (groupParser(data._source));
    });
  }
};

export default SearchGroupsTransform;
