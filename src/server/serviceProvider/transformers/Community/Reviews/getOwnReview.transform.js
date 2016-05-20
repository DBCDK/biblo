const GetOwnReviewTransform = {
  event() {
    return 'getOwnReview';
  },

  requestTransform(event, {reviewownerid, pids}) {
    let orFilter = [];
    let params = {
      filter: {
        order: 'created DESC',
        where: {
          markedAsDeleted: null,
          reviewownerid: reviewownerid
        }
      }
    };

    if (pids) {
      pids.forEach((pid) => {
        orFilter.push({pid: pid});
      });

      if (orFilter.length > 0) {
        params.filter.where = {
          and: [{reviewownerid: reviewownerid}, {markedAsDeleted: null}, {or: orFilter}]
        };
      }
    }

    return this.callServiceClient('community', 'getReviews', params);
  },

  responseTransform(response) {
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getOwnReview failed');
    }

    const reviews = JSON.parse(response.body);
    return {status: response.statusCode, data: reviews, errors: response.errors || []};
  }
};

export default GetOwnReviewTransform;
