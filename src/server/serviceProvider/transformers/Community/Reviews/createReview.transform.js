const CreateReviewTransform = {
  event() {
    return 'createReview';
  },

  upsertContent(query, user) {

    if (query.imageRemoveId) {
      this.callServiceClient('community', 'removeImage', {imageId: query.imageRemoveId});
    }

    return this.callServiceClient('community', 'createReview', {
      id: query.id || null,
      libraryid: query.libraryid,
      pid: query.pid,
      content: query.content,
      worktype: query.worktype,
      rating: query.rating,
      created: query.created || Date.now(),
      modified: Date.now(),
      reviewownerid: user.profileId,
      video: query.video
    }).then((response) => {

      // attach image to review
      if (response.statusCode === 200 && query.image) {
        const image = query.image;
        query.image = {data: 'Binary Image Data!'};
        return this.callServiceClient('community', 'updateImage', {
          relationId: response.body.id,
          image,
          accessToken: user.id,
          relationType: 'reviewImageCollection'
        }).then(() => {
          return response;
        });
        // video is attached on community server
      }
      return response;
    });
  },

  requestTransform(event, query, connection) {
    const user = Object.assign({}, connection.request.session.passport.user);
    return this.upsertContent(query, user);
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: response.errors || []};
  }
};

export default CreateReviewTransform;
