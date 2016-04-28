
const WorkTransform = {

  event() {
    return 'work';
  },

  requestTransform(event, {pids}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'work', {
      pids: pids,
      fields: [
        'collection',
        'coverUrlFull',
        'dcTitle',
        'subjectDBCF',
        'creator',
        'abstract',
        'workType',
        'date'
      ]
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return JSON.parse(response.body);
  }
};

export default WorkTransform;
