
const materialCql = {
  book:'term.worktype="literature"',
  game: 'term.worktype="game"',
  movie: 'term.worktype="movie"',
  music: 'term.worktype="music"',
  audiobook: '(term.type="lydbog" and term.worktype="literature")'
};


const SearchTransform = {

  event() {
    return 'search';
  },

  requestTransform(event, {q, forfatter, materialer, emneord, limit}, connection) { // eslint-disable-line no-unused-vars
    limit = (limit) ? limit : 20;

    // for now all queries are phrase queries
    if (q.indexOf('"') === -1) {
      // wrap fulltext search only query in quotes
      q = '"' + q + '"';
    }

    const cqlQuery = q;

    return this.callServiceClient('openplatform', 'search', {
      q: cqlQuery,
      fields: [
        'dcTitle',
        'pid',
        'workType'
        //'coverUrlFull'
      ],
      limit: limit
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return JSON.parse(response.body);
  }
};

export default SearchTransform;
