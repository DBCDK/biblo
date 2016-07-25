import parseProfile from './profile.parser';
import parseText from './text.parser';
import parseReview from './review.parser';

/**
 * Abstracts away common logic for comments shared across transforms.
 * @param {PlainObject} comment
 * @param {Array}campaigns
 * @returns {PlainObject}
 */
export default function parseComment(comment = {}, campaigns = []) {
  comment.owner = parseProfile(comment.owner, true, 'small');
  comment.image = comment.image && '/billede/' + comment.image.id + '/medium' || null;
  comment.html = parseText(comment.content);

  if (comment.review) {
    comment.review = parseReview(comment.review, campaigns);
  }

  return comment;
}
