import parseProfile from './profile.parser';
import parseText from './text.parser';

export default function parseComment(comment) {
  comment.owner = parseProfile(comment.owner, true, 'small');
  comment.image = comment.image && '/billede/' + comment.image.id + '/medium' || null;
  comment.html = parseText(comment.content);
  return comment;
}
