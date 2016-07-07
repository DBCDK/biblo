/**
 * @file: This file contains a transform to get the top reviews and populate them with briefdisplay and coverImage.
 */

const getTopReviewsTransform = {

  event() {
    return 'getTopReviews';
  },

  requestTransform(event, {size, age, ratingParameter, countsParameter}) {
    return this.callServiceClient('community', 'reviewSearch', {
      size,
      age,
      ratingParameter,
      countsParameter
    });
  },

  responseTransform(response) {
    return JSON.parse(response.body);
  }
};

export default getTopReviewsTransform;
