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
    let body = JSON.parse(response.body);
    body.hits = body.hits.map((data) => {
      return (groupParser(data._source));
    });

    return body.hits;
  }
};

export default SearchGroupsTransform;
