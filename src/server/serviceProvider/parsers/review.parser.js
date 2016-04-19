import parseProfile from './profile.parser';
import parseComment from './comment.parser';
import parseText from './text.parser';

export default function parseReview(review) {
  review.owner = parseProfile(review.owner, true, 'small');
  review.image = review.image && '/billede/' + review.image.id + '/medium' || null;
  review.likes = review.likes && review.likes.map(like => like.profileId || []);
  review.html = parseText(review.content);
  return review;
}
