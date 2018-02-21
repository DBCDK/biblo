import {log} from 'dbc-node-logger';

export async function getContributions(req, campaign, profileId) {
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

  if (campaign.type === 'review') {
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

  throw 'wrong campaign'; // group id missing?
}

export async function getUserContributedCampaigns (req, profileId) {
  let contributedCampaigns = [];

  let campaigns = (await req.callServiceProvider('getAllCampaigns', {}))[0].body;

  return new Promise((resolve, reject) => {
    let promises = [];
    campaigns.map(campaign => {
      promises.push(
        getContributions(req, campaign, profileId).then(contributions => {
          if (contributions && contributions.review.data.length > 0 || contributions.group.data.length > 0) {
            contributedCampaigns.push(campaign);
          }
        }).catch((err)=> {
          log.error('getting contributions from group failed. missing group id?:', err);
        })
      );
    });

    Promise.all(promises).then(function () {
      contributedCampaigns = contributedCampaigns.sort(
        (a, b) => {
          return (
            a.endDate < b.endDate
          );
        }
      );
      resolve(contributedCampaigns);
    }).catch((err) => {
      log.error(err);
      reject(err);
    });
  });

}
