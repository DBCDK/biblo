
const SearchTransform = {

  event() {
    return 'search';
  },

  requestTransform(event, {q}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'search', {q: q});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return JSON.parse(response.body);
  }
};

export default SearchTransform;
