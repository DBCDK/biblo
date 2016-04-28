
const WorkTransform = {

  event() {
    return 'work';
  },

  requestTransform(event, {pids}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'work', {
      pids: pids,
      fields: [
        'coverUrlFull',
        'dcTitle',
        'collection',
        'subjectDBCF',
        'creator',
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
