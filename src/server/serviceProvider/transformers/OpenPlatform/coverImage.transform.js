const CoverImageTransform = {
  event() {
    return 'coverImage';
  },

  // eslint-disable-next-line no-unused-vars
  requestTransform(event, {pid}, connection) {
    return this.callServiceClient('cached/standard/openplatform', 'work', {
      pids: [pid],
      fields: ['coverUrlFull', 'collection', 'workType']
    });
  },

  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query, connection) {
    let coverImageObject = {};
    let responseObject = JSON.parse(response.body).data[0];
    const workType = responseObject.workType[0];

    let coverUrl = `/images/covers/${workType}.png`;

    if (responseObject && responseObject.coverUrlFull && responseObject.coverUrlFull.length > 0) {
      coverUrl = responseObject.coverUrlFull;
    }

    responseObject.collection.forEach(pid => {
      coverImageObject[pid] = coverUrl;
    });

    return coverImageObject;
  }
};

export default CoverImageTransform;
