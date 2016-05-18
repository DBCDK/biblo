/* const materialCql = {
  book: 'term.worktype="literature"',
  game: 'term.worktype="game"',
  movie: 'term.worktype="movie"',
  music: 'term.worktype="music"',
  audiobook: '(term.type="lydbog" and term.worktype="literature")'
}; */


const SearchTransform = {

  event() {
    return 'search';
  },

  requestTransform(event, {q, forfatter, materialer, emneord, limit}, connection) { // eslint-disable-line no-unused-vars
    limit = (limit) ? limit : 20;

    let topLevelCql = [];

    // for now all queries are phrase queries
    if (q) {
      if (q.indexOf('"') === -1) {
        // wrap fulltext search only query in quotes
        q = '"' + q + '"';
      }
    }
    else {
      q = '"*"';
    }
    // add freetext cql part
    topLevelCql.push(q);


    if (materialer) {
      const materialCql = materialer.split(',').map((type) => '(term.worktype="' + type + '")').join(' OR ');
      topLevelCql.push(materialCql);
    }

    if (forfatter) {
      topLevelCql.push('term.creator="' + forfatter + '"');
    }

    if (emneord) {
      const subjectCql = emneord.split(',').map((type) => '(term.subject="' + type + '")').join(' OR ');
      topLevelCql.push(subjectCql);
    }

    const cqlQuery = topLevelCql.map((cql) => '('+cql+')').join(' AND ');

    return this.callServiceClient('openplatform', 'search', {
      q: cqlQuery,
      fields: [
        'dcTitle',
        'pid',
        'workType',
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
