const GetOwnReviewTransform = {
  event() {
    return 'getOwnReview';
  },

  requestTransform(event, {reviewownerid, pid}) {
    let params = {
      filter: {
        where: {
          pid: pid,
          reviewownerid: reviewownerid
        }
      }
    };

    return this.callServiceClient('community', 'getReviews', params);
  },

  responseTransform(response) {
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getOwnReview failed');
    }
    let reviews = JSON.parse(response.body);
    return {status: response.statusCode, data: reviews, errors: response.errors || []};
  }
};
export default GetOwnReviewTransform;
