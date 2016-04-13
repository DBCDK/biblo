const UpdateReviewTransform = {
  event() {
    return 'updateReview';
  },

  requestTransform(event, query, connection) {
    const passport = connection.request.session.passport;
    if (connection.request.session.passport) {
      return this.callServiceClient('community', 'updateReview', {
        id: query.id,
        pid: query.pid,
        content: query.content,
        worktype: query.worktype,
        rating: query.rating,
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

export default UpdateReviewTransform;
