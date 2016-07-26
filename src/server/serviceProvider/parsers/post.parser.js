import parseProfile from './profile.parser';
import parseComment from './comment.parser';
import parseText from './text.parser';
import parseReview from './review.parser';

/**
 * Abstracts away common logic for posts shared across transforms.
 * @param {PlainObject} post
 * @param {Array}campaigns
 * @returns {PlainObject}
 */
export default function parsePost(post = {}, campaigns = []) {
  post.owner = parseProfile(post.owner, true, 'small');
  post.image = post.image && '/billede/' + post.image.id + '/medium' || null;
  post.comments = post.comments && post.comments.map(comment => parseComment(comment, campaigns)) || [];
  post.likes = post.likes && post.likes.map(like => like.profileId || []);
  post.html = parseText(post.content);

  campaigns.forEach(campaign => {
    if (campaign.group && campaign.group.id === post.groupid) {
      post.campaign = campaign;
    }
  });

  if (post.review) {
    post.review = parseReview(post.review, campaigns);
  }

  return post;
}
