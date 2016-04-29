import parseReview from '../../../parsers/review.parser';

const GetReviewTransform = {
  event() {
    return 'getReviews';
  },

  requestTransform(event, {id, collection, skip, limit}, connection) {
    return new Promise((resolve, reject) => {
      const user = connection.request.user || {id: ''};
      const accessToken = user.id;
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

      Promise.all([
        this.callServiceClient('community', 'countReviews', {accessToken, where: {or: orFilter}}),
        this.callServiceClient('community', 'getReviews', params)
      ])
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  responseTransform(response) {
    if (response[1].statusCode !== 200) {
      throw new Error('Call to community service, with method getReviews failed');
    }

    let reviewsCount = JSON.parse(response[0].body);
    let reviews = JSON.parse(response[1].body);
    reviews = reviews.map(review => parseReview(review)) || [];

    return {
      status: response[1].statusCode, reviewsCount: reviewsCount.count,
      data: reviews, errors: response[1].errors || []
    };
  }
};

export default GetReviewTransform;
