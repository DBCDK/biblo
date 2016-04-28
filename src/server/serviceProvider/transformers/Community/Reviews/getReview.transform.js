import parseReview from '../../../parsers/review.parser';

const GetReviewTransform = {
  event() {
    return 'getReviews';
  },

  requestTransform(event, {id, collection, skip=0, limit=15}) {
    let orFilter = [];
    let params = {
      filter: {
        skip: skip,
        limit: limit,
        order: 'created DESC',
        include: [
          'likes',
          'image',
          {
            relation: 'video',
            scope: {
              include: [
                'resolutions'
              ]
            }
          },
          {
            relation: 'owner',
            scope: {
              include: ['image']
            }
          }
        ]
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

    if (id) {
      params.filter.where = {id: id};
    }

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
