const LikeReviewTransform = {
  event() {
    return 'likeReview';
  },

  requestTransform(event, query, connection) {
    // eslint-disable-line no-unused-vars
    // check user is logged in
    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;
      const profileId = passport.user.profileId;
      const reviewId = query.reviewId;
      const accessToken = passport.user.id;

      return this.callServiceClient('community', 'likeReview', {profileId, reviewId, accessToken})
        .then(() => {
          // Fetch the work pid in order to invalidate cache.
          // this is cached heavily, since reviewId->pid isn't changing
          return this.callServiceClient('cached/extended/community', 'getReviews', {filter: {where: {id: reviewId}}});
        })
        .then(response => {
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

  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query, connection) {
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method likeReview failed');
    }

    // TODO: return response in correct format
    return JSON.parse(response.body);
  }
};

export default LikeReviewTransform;
