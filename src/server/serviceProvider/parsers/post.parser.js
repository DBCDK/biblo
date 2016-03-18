'use strict';

import parseProfile from './profile.parser';
import parseComment from './comment.parser';
import parseText from './text.parser';

export default function parsePost(post) {
  post.owner = parseProfile(post.owner, true, 'small');
  post.image = post.image && '/billede/' + post.image.id + '/medium' || null;
  post.comments = post.comments && post.comments.map(comment => parseComment(comment)) || [];
  post.likes = post.likes && post.likes.map(like => like.profileId || []);
  post.html = parseText(post.content);
  return post;
}
