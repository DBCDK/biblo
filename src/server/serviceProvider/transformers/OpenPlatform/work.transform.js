const WorkTransform = {

  event() {
    return 'work';
  },

  requestTransform(event, {pids}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'work', {
      pids: pids,
      fields: [
        'dcTitle',
        'dcTitleFull',
        'publisher',
        'description',
        'descriptionSeries',
        'extent',
        'format',
        'collection',
        'collectionDetails',
        'coverUrlFull',
        'dcLanguage',
        'accessType',
        'audienceAge',
        'audience',
        'audienceMedieraad',
        'audiencePegi',
        'subjectDK5',
        'subjectDK5Text',
        'subjectDBCM',
        'subjectDBCN',
        'subjectDBCO',
        'subjectDBCS',
        'creator',
        'dcCreator',
        'creatorActPeriod',
        'creatorArt',
        'creatorAut',
        'creatorDrt',
        'creatorSort',
        'contributorAct',
        'contributor',
        'abstract',
        'workType',
        'type',
        'date'
      ]
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return JSON.parse(response.body);
  }
};

export default WorkTransform;
