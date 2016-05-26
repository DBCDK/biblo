import parseProfile from './profile.parser';
import parseComment from './comment.parser';
import parseText from './text.parser';
import parseReview from './review.parser';

export default function parsePost(post, campaigns = []) {
  post.owner = parseProfile(post.owner, true, 'small');
  post.image = post.image && '/billede/' + post.image.id + '/medium' || null;
  post.comments = post.comments && post.comments.map(comment => parseComment(comment, campaigns)) || [];
  post.likes = post.likes && post.likes.map(like => like.profileId || []);
  post.html = parseText(post.content);

  if (post.review) {
    post.review = parseReview(post.review, campaigns);
  }

  return post;
}
