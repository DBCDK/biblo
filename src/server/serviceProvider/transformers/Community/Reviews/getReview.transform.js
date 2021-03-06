import parseReview from '../../../parsers/review.parser';

const GetReviewTransform = {
  event() {
    return 'getReviews';
  },

  requestTransform(event, {id, pids, skip, limit = 5, where, order = 'created DESC'}, connection) {
    return new Promise((resolve, reject) => {
      const user = connection.request.user || {id: null};
      const accessToken = user.id;
      let orFilter = [];
      let params = {
        filter: {
          skip,
          limit,
          order,
          include: [
            'likes',
            'image',
            {
              relation: 'video',
              scope: {
                include: [
                  {
                    relation: 'resolutions',
                    scope: {
                      include: ['video']
                    }
                  }
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

      if (where) {
        params.filter.where = where;
      } else if (pids) {
        pids.forEach(pid => {
          orFilter.push({pid: pid});
        });

        if (orFilter.length > 0) {
          params.filter.where = {
            and: [{markedAsDeleted: null}, {or: orFilter}]
          };
        }
      } else {
        params.filter.where = {markedAsDeleted: null, id: id};
      }

      Promise.all([
        this.callServiceClient('cached/standard/community', 'countReviews', {accessToken, where: params.filter.where}),
        this.callServiceClient('cached/standard/community', 'getReviews', params),
        this.callServiceClient('cached/standard/community', 'getReviewCampaigns')
      ])
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  responseTransform(response, {limitReviewContent = 0}) {
    if (response[1].statusCode !== 200) {
      throw new Error('Call to community service, with method getReviews failed');
    }

    let reviewsCount = JSON.parse(response[0].body);
    let reviews = response[1].body;
    const campaigns = response[2];
    reviews = reviews.map(review => parseReview(review, campaigns, limitReviewContent)) || [];

    return {
      status: response[1].statusCode,
      reviewsCount: reviewsCount.count,
      data: reviews,
      errors: response[1].errors || []
    };
  }
};

export default GetReviewTransform;
