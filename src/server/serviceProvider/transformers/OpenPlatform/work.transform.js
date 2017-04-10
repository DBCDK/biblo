import workParser from '../../parsers/work.parser';

const WorkTransform = {
  event() {
    return 'work';
  },

  requestTransform(event, {pids, fields = null}, connection) { // eslint-disable-line no-unused-vars
    const pidsCopy = [].concat(pids);
    const workRequests = [];
    while (pidsCopy.length > 0) {
      workRequests.push(pidsCopy.splice(0, 20));
    }

    return Promise.all(
      workRequests.map(
        pidBucket => this.callServiceClient('cached/standard/openplatform', 'work', {
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

    const body = {statusCode: 200};
    body.requestedPids = query.pids;
    body.data = data.map(workParser);
    return body;
  }
};

export default WorkTransform;
