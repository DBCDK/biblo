import workParser from '../../parsers/work.parser';

const WorkTransform = {
  event() {
    return 'work';
  },

  requestTransform(event, {pids, fields = null}, connection) { // eslint-disable-line no-unused-vars
    const workRequests = [];
    while (pids.length > 0) {
      workRequests.push(pids.splice(0, 20));
    }

    return Promise.all(
      workRequests.map(
        pidBucket => this.callServiceClient('openplatform', 'work', {
          pids: pidBucket,
          fields: fields || [
            'dcTitle',
            'dcTitleFull',
            'titleSeries',
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
        })
      )
    );
  },

  responseTransform(responses, query, connection) { // eslint-disable-line no-unused-vars
    let data = [];
    responses.forEach(response => {
      const responseBody = JSON.parse(response.body);
      if (responseBody.data) {
        data = data.concat(responseBody.data);
      }
    });

    const body = {};
    body.requestedPids = query.pids;
    body.data = data.map(workParser);
    return body;
  }
};

export default WorkTransform;
