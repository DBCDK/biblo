
const WorkTransform = {

  event() {
    return 'work';
  },

  requestTransform(event, {pids}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'search', {
      // pids: pids,
      q: `rec.id=${pids}`,
      fields: [
        'coverUrlFull',
        'dcTitle',
        'collection',
        'collectionDetails',
        'coverUrlFull',
        'dcTitle',
        'dcLanguage',
        'accessType',
        'audienceAge',
        'subjectDK5',
        'subjectDK5Text',
        'titleSeries',
        'subjectDBCF',
        'creator',
        'abstract',
        'workType',
        'type',
        'date'
      ],
      limit: 10
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return JSON.parse(response.body);
  }
};

export default WorkTransform;
