import parseProfile from './profile.parser';
import parseText from './text.parser';
import {uniq} from 'lodash';

export default function parseReview(review, campaigns = [], limitReviewContent) {
  campaigns.forEach(campaign => {
    const reviewCreatedEpoch = (new Date(review.created)).getTime();
    const campaignStartEpoch = (new Date(campaign.startDate)).getTime();
    const campaignEndEpoch = (new Date(campaign.endDate)).getTime();

    if (
      reviewCreatedEpoch - campaignStartEpoch > 0 && // Review was created after the campaign started.
      campaignEndEpoch - reviewCreatedEpoch > 0 && // Review was created before the campaign ended.
      campaign.workTypes.indexOf(review.worktype) > -1 // Review is of the correct work type.
    ) {
      review.campaign = campaign;
    }
  });

  let content = review.content;
  if (limitReviewContent > 0 && content.length > limitReviewContent) {
    content = `${content.substr(0, limitReviewContent)}...`;
  }

  review.owner = parseProfile(review.owner, true, 'small');
  review.imageId = review.image && review.image.id; // we currently only allow one image at a time
  review.image = review.image && '/billede/' + review.image.id + '/medium' || null;
  review.likes = review.likes && uniq(review.likes.map(like => like.profileId)) || [];
  review.html = parseText(content, true, 'break');

  return review;
}
