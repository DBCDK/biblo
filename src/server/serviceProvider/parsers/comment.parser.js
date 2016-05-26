import parseProfile from './profile.parser';
import parseText from './text.parser';
import parseReview from './review.parser';

export default function parseComment(comment, campaigns = []) {
  comment.owner = parseProfile(comment.owner, true, 'small');
  comment.image = comment.image && '/billede/' + comment.image.id + '/medium' || null;
  comment.html = parseText(comment.content);

  if (comment.review) {
    comment.review = parseReview(comment.review, campaigns);
  }

  return comment;
}
