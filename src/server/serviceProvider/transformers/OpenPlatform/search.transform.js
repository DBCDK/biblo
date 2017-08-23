const type2Cql = {
  book: 'term.worktype="literature"',
  game: 'term.worktype="game"',
  movie: 'term.worktype="movie"',
  music: 'term.worktype="music"',
  audiobook: '(term.type="lydbog" and term.worktype="literature")'
};

const SearchTransform = {

  event() {
    return 'search';
  },

  requestTransform(event, {q, seriesTitle, forfatter, materialer, emneord, limit, offset, rankSort, fields}, connection) { // eslint-disable-line no-unused-vars

    offset = (offset) ? offset : 0;
    rankSort = (rankSort) ? rankSort : 'rank_frequency';

    const topLevelCql = [];

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
      const materialCql = materialer.split(',').map((type) => '(' + type2Cql[type] + ')').join(' OR ');
      topLevelCql.push(materialCql);
    }

    if (forfatter) {
      topLevelCql.push('term.creator="' + forfatter + '"');
    }

    if (emneord) {
      const subjectCql = emneord.split(',').map((type) => '(term.subject="' + type + '")').join(' OR ');
      topLevelCql.push(subjectCql);
    }

    if (typeof seriesTitle === 'string') {
      seriesTitle = seriesTitle.replace('&', '&amp;');
      topLevelCql.push(`phrase.titleSeries="${seriesTitle}"`);
    }

    if (fields && fields.indexOf('workType') < 0) {
      fields.push('workType');
    }

    const cqlQuery = topLevelCql.map((cql) => '('+cql+')').join(' AND ');

    return this.callServiceClient('cached/short/openplatform', 'search', {
      q: cqlQuery,
      fields: fields || [
        'collectionDetails',
        'dcTitle',
        'pid',
        'workType',
        'coverUrlFull'
      ],
      limit: limit,
      offset: offset,
      sort: rankSort
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    const ret = JSON.parse(response.body);
    ret.data = (ret.data || []).map(work => {
      if (work.coverUrlFull && work.coverUrlFull.length > 0) {
        work.coverUrl = work.coverUrlFull[0];
      }
      else if (work.workType) {
        work.coverUrl = `/images/covers/${work.workType}.png`;
      }
      else {
        work.coverUrl = '/images/covers/other.png';
      }

      return work;
    });
    ret.q = query;
    return ret;
  }
};

export default SearchTransform;
