'use strict';

import {orderBy} from 'lodash';

const GetGroupTransform = {

  event() {
    return 'getGroup';
  },

  parseProfile(owner) {
    if (owner) {

      return {
        id: owner.id,
        displayName: owner.displayName
      };
    }
  },

  parseComment(comment) {
    comment.owner = this.parseProfile(comment.owner);
    return comment;
  },

  parsePost(post) {
    post.owner = this.parseProfile(post.owner);
    post.image = post.image && '/billede/' + post.image.id || null;
    post.comments = post.comments.map(comment => this.parseComment(comment));
    return post;
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('community', 'getGroup', query);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    const body = JSON.parse(response.body);

    if (response.statusCode === 200) {
      body.posts = body.posts.map(post => this.parsePost(post));
      body.posts = orderBy(body.posts, 'timeCreated', 'desc');
      return body;
    }

    return {error: 'Gruppen kan ikke findes'};
  }
};

export default GetGroupTransform;
