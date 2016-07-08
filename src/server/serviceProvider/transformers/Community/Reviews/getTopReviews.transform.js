/**
 * @file: This file contains a transform to get the top reviews and populate them with briefdisplay and coverImage.
 */

const getTopReviewsTransform = {

  event() {
    return 'getTopReviews';
  },

  requestTransform(event, {size, age, ratingParameter, countsParameter}) {
    return this.callServiceClient('community', 'topWorksFromReviews', {
      size,
      age,
      ratingParameter,
      countsParameter
    });
  },

  responseTransform(response) {
    return {statusCode: response.statusCode, data: JSON.parse(response.body), errors: []};
  }
};

export default getTopReviewsTransform;
