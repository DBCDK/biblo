import parseReview from '../../../parsers/review.parser';

const GetReviewTransform = {
  event() {
    return 'getCampaignReviews';
  },

  requestTransform(event, {skip, limit, order='created DESC', campaignId, wheres = []}) {
    return this.callServiceClient('community', 'getCampaign', {id: campaignId}).then(campaignResponse => {
      const campaign = campaignResponse.body;
      const startDate = campaign.startDate;
      const endDate = campaign.endDate;
      campaign.workTypes = campaign.workTypes.map(w => w.worktype);

      const params = {
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
                  }]
              }
            },
            {
              relation: 'owner',
              scope: {
                include: ['image']
              }
            }
          ],
          where: {
            and: [
              {created: {gte: startDate}},
              {created: {lte: endDate}},
              {markedAsDeleted: null},
              {or: campaign.workTypes.map(w => ({worktype: w}))} // Only get reviews when they have one of the predefined worktypes.
            ].concat(wheres)
          }
        }
      };

      return Promise.all([
        this.callServiceClient('community', 'countReviews', {where: params.filter.where}),
        this.callServiceClient('community', 'getReviews', params),
        Promise.resolve([campaign])
      ]);
    });
  },

  responseTransform(response, {campaignId}) {
    if (response[1].statusCode !== 200) {
      throw new Error('Call to community service, with method getReviews failed');
    }

    let reviewsCount = JSON.parse(response[0].body);
    let reviews = JSON.parse(response[1].body);
    const campaigns = response[2];
    reviews = reviews.map(review => parseReview(review, campaigns)) || [];

    return {
      campaignId,
      status: response[1].statusCode,
      reviewsCount: reviewsCount.count,
      data: reviews,
      errors: response[1].errors || []
    };
  }
};

export default GetReviewTransform;
