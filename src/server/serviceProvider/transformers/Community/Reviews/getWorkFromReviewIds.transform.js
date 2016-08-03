/**
 * @file: This file implements a transform that gets works from review ids.
 */

const getWorkFromReviewIdsTransform = {
  event() {
    return 'getWorkFromReviewIds';
  },

  requestTransform(event, {ids}) {
    return this.callServiceClient('community', 'getReviews', {
      filter: {
        where: {
          or: ids.map(id => ({id}))
        }
      }
    }).then(reviewsResponse => {
      const reviews = reviewsResponse.body;
      return Promise.all(reviews.map(review => this.callServiceClient('openplatform', 'work', {
        pids: [review.pid],
        fields: [
          'collection',
          'dcTitle',
          'workType',
          'coverUrlFull'
        ]
      })));
    });
  },

  responseTransform(response) {
    const works = response.map(workResponse => JSON.parse(workResponse.body).data[0]);

    return {
      status: 200,
      data: works
    };
  }
};

export default getWorkFromReviewIdsTransform;
