import parseReview from '../../../parsers/review.parser';


const GetReviewTransform = {
  event() {
    return 'getReviews';
  },

  requestTransform(event, params) {
    return this.callServiceClient('community', 'getReviews', params);
  },

  responseTransform(response) {
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getReviews failed');
    }

    let reviews = JSON.parse(response.body);
    reviews = reviews.map(review => parseReview(review)) || [];
    return {status: response.statusCode, data: reviews, errors: response.errors || []};
  }

};

export default GetReviewTransform;
