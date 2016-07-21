import parseReview from '../../../parsers/review.parser';

const GetOwnReviewTransform = {
  event() {
    return 'getOwnReview';
  },

  requestTransform(event, {reviewownerid, pids, limit = 0, offset = 0}) {
    let orFilter = [];
    let params = {
      filter: {
        order: 'created DESC',
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
                }]
            }
          }
        ],
        where: {
          markedAsDeleted: null,
          reviewownerid: reviewownerid
        }
      }
    };

    if (limit) {
      params.filter.limit = limit;
    }

    if (offset) {
      params.filter.offset = offset;
    }

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

    return Promise.all([
      this.callServiceClient('community', 'getReviews', params),
      this.callServiceClient('community', 'getReviewCampaigns')
    ]);
  },

  responseTransform(response) {
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getOwnReview failed');
    }

    const campaigns = response[1];
    const reviews = (JSON.parse(response[0].body) || []).map(review => parseReview(review, campaigns));

    return {status: response.statusCode, data: reviews, errors: response.errors || []};
  }
};

export default GetOwnReviewTransform;
