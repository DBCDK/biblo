const GetReviewTransform = {
  event() {
    return 'getReview';
  },

  requestTransform(event, query, connection) {
    const passport = connection.request.session.passport;
    if (passport) {
      return this.callServiceClient('community', 'getReview', {
        id: query.pid
      });
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: response.errors || []};
  }
};

export default GetReviewTransform;
