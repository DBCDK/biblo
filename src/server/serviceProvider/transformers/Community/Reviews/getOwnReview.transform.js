const GetOwnReviewTransform = {
  event() {
    return 'getOwnReview';
  },

  requestTransform(event, {reviewownerid, collection}) {

    let orFilter = [];

    let params = {
      filter: {
        where: {
          reviewownerid: reviewownerid
        }
      }
    };

    if (collection) {
      collection.forEach((pid) => {
        orFilter.push({pid: pid});
      });

      if (orFilter.length > 0) {
        params.filter.where = {
          or: orFilter
        };
      }
    }

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
