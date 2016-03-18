'use strict';

import parseProfile from '../../../parsers/profile.parser';

const GetPostsTransform = {

  event() {
    return 'getPosts';
  },

  parseComment(comment) {
    comment.owner = parseProfile(comment.owner, true, 'small');
    comment.image = comment.image && '/billede/' + comment.image.id + '/medium' || null;
    return comment;
  },


  parseLike(like) {
    return like.profileId;
  },

  parsePost(post) {
    post.owner = parseProfile(post.owner, true, 'small');
    post.image = post.image && '/billede/' + post.image.id + '/medium' || null;
    post.comments = post.comments && post.comments.map(comment => this.parseComment(comment)) || [];
    post.likes = post.likes && post.likes.map(like => this.parseLike(like)) || [];
    return post;
  },

  fetchCommentsForPost(post, limit=1, skip=0) {
    const commentFilter = {
      limit: limit,
      skip: skip,
      order: 'timeCreated DESC',
      include: ['image', {owner: ['image']}],
      where: {postid: post.id}
    };

    return this.callServiceClient('community', 'getComments', {id: post.id, filter: commentFilter})
      .then(response => {
        post.comments = JSON.parse(response.body);
        post.numberOfCommentsLoaded = skip + limit;
        return post;
      });
  },

  requestTransform(event, {id, skip, limit}, connection) { // eslint-disable-line no-unused-vars

    const postFilter = {
      limit: limit,
      skip: skip,
      counts: 'comments',
      where: {groupid: id},
      order: 'timeCreated DESC',
      include: ['image', {owner: ['image']}, 'likes']
    };

    return this.callServiceClient('community', 'getPosts', {id, filter: postFilter});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getPosts failed');
    }

    const posts = JSON.parse(response.body);
    return Promise.all(posts.map(post => this.fetchCommentsForPost(post)
      .then(postWithComments => this.parsePost(postWithComments))));
  }
};

export default GetPostsTransform;
