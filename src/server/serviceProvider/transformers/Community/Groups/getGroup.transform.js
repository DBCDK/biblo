'use strict';

import * as _ from 'lodash';

const GetGroupTransform = {

  event() {
    return 'getGroup';
  },

  parseProfile(owner) {
    if (owner) {
      return {
        id: owner.id,
        displayName: owner.displayName,
        image: owner.image && '/billede/' + owner.image.id || null
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
    post.comments = post.comments.map(comment => this.parseComment(comment));
    return post;
  },

  requestTransform(event, {id}, connection) { // eslint-disable-line no-unused-vars

    const filter = [
      {
        relation: 'posts',
        scope: {
          limit: 10,
          order: 'timeCreated DESC',
          include: ['image', {owner: ['image']}, {
            relation: 'comments',
            scope: {
              limit: 1,
              order: 'timeCreated DESC',
              include: ['image', {owner: ['image']}]
            }
          }]
        }
      },
      {
        relation: 'members'
      }
    ];
    return this.callServiceClient('community', 'getGroup', {id, filter});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars


    if (response.statusCode === 200) {

      const uid = connection.request.session.passport.user.profileId;

      const body = JSON.parse(response.body);
      body.posts = body.posts.map(post => this.parsePost(post));
      // is the current user following the group?
      body.isFollowing = _.filter(body.members, (member) => uid === member.id).length !== 0;

      return body;
    }

    return {error: 'Gruppen kan ikke findes'};
  }
};

export default GetGroupTransform;
