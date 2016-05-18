
const CoverImageTransform = {

  event() {
    return 'coverImage';
  },

  requestTransform(event, {pid}, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'work', {
      pids: [pid],
      fields: [
        'coverUrlFull',
        'collection',
        'workType'
      ]
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    let coverImageObject = {};
    let responseObject = JSON.parse(response.body).data[0];
    const workType = responseObject.workType[0];

    let coverUrl = `/images/covers/${workType}.png`;

    if (responseObject && responseObject.coverUrlFull && responseObject.coverUrlFull.length > 0) {
      coverUrl = responseObject.coverUrlFull;
    }

    responseObject.collection.forEach((pid) => {
      coverImageObject[pid] = coverUrl;
    });

    return coverImageObject;
  }
};

export default CoverImageTransform;
