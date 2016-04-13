const CreateReviewTransform = {
  event() {
    return 'createReview';
  },

  requestTransform(event, query, connection) {
    const passport = connection.request.session.passport;
    if (passport) {
      return this.callServiceClient('community', 'createReview', {
        pid: query.pid,
        content: query.content,
        worktype: query.worktype,
        rating: query.rating,
        created: Date.now(),
        modified: Date.now(),
        reviewownerid: passport.profileId
      });
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: response.errors || []};
  }
};

export default CreateReviewTransform;
