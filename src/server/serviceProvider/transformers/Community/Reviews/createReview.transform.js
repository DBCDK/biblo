const CreateReviewTransform = {
  event() {
    return 'createReview';
  },

  upsertContent(query, user) {
    let method="createReview";
    if (review.id) {
      method= "updateReview";
    }

    return this.callServiceClient('community', method, {
      id: query.id || null,
      pid: query.pid,
      content: query.content,
      worktype: query.worktype,
      rating: query.rating,
      created: querycreated || Date.now(),
      modified: Date.now(),
      reviewownerid: user.profileId
    }).then((response) => {

      //attach image to review
      if (response.statusCode === 200 && review.image) {
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

        //vide is attach on community server
      }
      return response;
    });
  },

  requestTransform(event, query, connection) {
    const user = Object.assign({}, connection.request.session.passport.user);

    this.upserConntent(query,  user);
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: response.errors || []};
  }
};

export default CreateReviewTransform;
