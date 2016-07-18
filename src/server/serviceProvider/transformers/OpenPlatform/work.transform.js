import workParser from '../../parsers/work.parser';

const WorkTransform = {

  event() {
    return 'work';
  },

  requestTransform(event, {pids, fields = null}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'work', {
      pids: pids,
      fields: fields || [
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
        'date',
        'hasOnlineAccess'
      ]
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    let body = JSON.parse(response.body);
    body.requestedPids = query.pids;
    body.data = body.data.map(workParser);
    return body;
  }

};

export default WorkTransform;
