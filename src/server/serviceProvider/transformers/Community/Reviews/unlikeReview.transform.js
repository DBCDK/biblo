const UnlikeReviewTransform = {

  event() {
    return 'unlikeReview';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    // check user is logged in
    if (connection.request.session.passport) {

      const passport = connection.request.session.passport;
      const profileId = passport.user.profileId;
      const reviewId = query.reviewId;
      const accessToken = passport.user.id;
      return this.callServiceClient('community', 'unlikeReview', {profileId, reviewId, accessToken})
        .then(() => {
          // Fetch the work pid in order to invalidate cache.
          // this is cached heavily, since reviewId->pid isn't changing
          return this.callServiceClient('cached/extended/community', 'getReviews', {filter: {where: {id: reviewId}}});
        })
        .then((response) => {
          // We got to invalidate some cache -
          // possibly a request made with pid and with reviewId
          if (response.body && response.body.length > 0) {
            this.invalidateCache(`*getReviews*"where":{"markedAsDeleted":null,"id":"${reviewId}"}*`);
            this.invalidateCache(`*getReviews*${response.body[0].pid}*`);
          }
        });
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method unlikeReview failed');
    }

    // TODO: return response in correct format
    return JSON.parse(response.body);
  }
};

export default UnlikeReviewTransform;
