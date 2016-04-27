
const SearchTransform = {

  event() {
    return 'search';
  },

  requestTransform(event, {q, limit}, connection) { // eslint-disable-line no-unused-vars

    limit = (limit)? limit : 20;

    return this.callServiceClient('openplatform', 'search', {
      q: q,
      fields: [
        'dcTitle',
        'pid',
        'coverUrlFull'
      ],
      limit: limit
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return JSON.parse(response.body);
  }
};

export default SearchTransform;
