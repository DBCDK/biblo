const LikeReviewTransform = {

  event() {
    return 'likeReview';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    // check user is logged in
    if (connection.request.session.passport) {
      // If user is logged in like on post
      const passport = connection.request.session.passport;
      const profileId = query.profileId;
      const reviewId = query.contentId;
      const accessToken = passport.user.id;
      return this.callServiceClient('community', 'likeReview', {profileId, reviewId, accessToken});
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars

    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method likeReview failed');
    }

    // TODO: return response in correct format
    return JSON.parse(response.body);
  }
};

export default LikeReviewTransform;
