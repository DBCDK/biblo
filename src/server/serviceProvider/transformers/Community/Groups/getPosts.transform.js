'use strict';

const GetPostsTransform = {

  event() {
    return 'getPosts';
  },

  parseProfile(owner) {
    if (owner) {
      return {
        id: owner.id,
        displayName: owner.displayName,
        image: owner.image && '/billede/' + owner.image.id + '/medium' || null
      };
    }

    // All posts, groups and comments should have an owner. This is a fallback in case of mysterious events
    return {
      id: 0,
      displayName: 'Anonym',
      image: 'http://lorempixel.com/200/200/'
    };
  },

  parseComment(comment) {
    comment.owner = this.parseProfile(comment.owner);
    comment.image = comment.image && '/billede/' + comment.image.id + '/medium' || null;
    return comment;
  },

  parsePost(post) {
    post.owner = this.parseProfile(post.owner);
    post.image = post.image && '/billede/' + post.image.id + '/medium' || null;
    post.comments = post.comments && post.comments.map(comment => this.parseComment(comment)) || [];
    return post;
  },

  requestTransform(event, {id, skip, limit}, connection) { // eslint-disable-line no-unused-vars

    const postFilter = {
      limit: limit,
      skip: skip,
      counts: 'comments',
      where: {groupid: id},
      order: 'timeCreated DESC',
      include: ['image', {owner: ['image']}]
    };

    return this.callServiceClient('community', 'getPosts', {id, filter: postFilter});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getPosts failed');
    }

    const posts = JSON.parse(response.body);
    return posts.map(post => this.parsePost(post));
  }
};

export default GetPostsTransform;
