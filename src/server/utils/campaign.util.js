export function getContributions(req, campaign, profileId) {
  const contributions = {group: {data: [], postsCount: 0}, review: {data: [], reviewsCount: 0}};

  if (campaign.type === 'group' && campaign.group && campaign.group.id) {
    const getPostsArgs = {
      limit: null,
      skip: 0,
      id: campaign.group.id,
      where: {
        and: [
          {postownerid: profileId},
          {timeCreated: {gte: campaign.startDate}},
          {timeCreated: {lte: campaign.endDate}}
        ]
      }
    };

    return req.callServiceProvider('getPosts', getPostsArgs).then(posts => {
      contributions.group = {postsCount: posts[0].length, data: posts[0]};
      return contributions;
    });
  }

  const getCampaignReviewsParams = {
    campaignId: campaign.id,
    wheres: [
      {reviewownerid: profileId}
    ]
  };

  return req.callServiceProvider('getCampaignReviews', getCampaignReviewsParams).then(reviews => {
    contributions.review = reviews[0];
    return contributions;
  });
}

export async function getUserContributedCampaigns (req, profileId) {
  let contributedCampaigns = [];
  let campaigns = (await req.callServiceProvider('getAllCampaigns', {}))[0].body;
  await Promise.all(campaigns.map(campaign => {
    return getContributions(req, campaign, profileId).then(contributions => {
      if (contributions.review.data.length > 0 || contributions.group.data.length > 0) {
        contributedCampaigns.push(campaign);
      }
    });
  }));
  return contributedCampaigns;
}
