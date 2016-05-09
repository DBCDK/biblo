
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
        'description',
        'descriptionSeries',
        'extent',
        'format',
        'collection',
        'collectionDetails',
        'coverUrlFull',
        'dcTitle',
        'dcLanguage',
        'accessType',
        'audienceAge',
        'audience',
        'audienceMedieraad',
        'audiencePegi',
        'subjectDK5',
        'subjectDK5Text',
        'titleSeries',
        'partOf',
        'hasPartTrack',
        'hasAdaptation',
        'hasOnlineAccess',
        'shelfMusicshelf',
        'subject',
        'subjectGenre',
        'subjectLCSH',
        'subjectDBCF',
        'subjectDBCM',
        'subjectDBCN',
        'subjectDBCO',
        'subjectDBCS',
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
