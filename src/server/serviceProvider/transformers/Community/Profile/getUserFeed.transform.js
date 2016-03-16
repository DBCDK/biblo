'use strict';

import assignToEmpty from '../../../../../client/Utils/assign';

/**
 * @file
 * Get a users feed.
 */
const getUserFeedTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getUserFeed';
  },

  /**
   *
   * @param event
   * @param userId
   * @param offset
   * @param connection
   * @returns {Promise}
   */
  requestTransform(event, {userId, offset}, connection) {
    return new Promise((resolve, reject) => {
      const user = connection.request.user || {id: ''};
      const accessToken = user.id;
      offset = offset || 0;
      const profileFilter = {
        include: ['image', {relation: 'groups', scope: {include: ['coverImage']}}]
      };

      const commentsWhere = {
        commentownerid: userId
      };

      const postsWhere = {
        postownerid: userId
      };

      const postsFilter = {
        where: postsWhere,
        include: [
          {relation: 'group', scope: {include: ['coverImage']}},
          {relation: 'owner', scope: {include: ['image']}},
          'image'
        ],
        limit: 5,
        skip: offset,
        order: 'timeCreated DESC'
      };

      const commentsFilter = {
        where: commentsWhere,
        include: [
          {
            relation: 'post',
            scope: {
              include: [{
                relation: 'group',
                scope: {
                  include: [
                    'coverImage'
                  ]
                }
              }, {
                relation: 'owner',
                scope: {
                  include: ['image']
                }
              }, 'image']
            }
          },
          {relation: 'owner', scope: {include: ['image']}},
          'image'
        ],
        limit: 5,
        skip: offset,
        order: 'timeCreated DESC'
      };

      Promise.all([
        this.callServiceClient('community', 'getPosts', {accessToken, filter: postsFilter}),
        this.callServiceClient('community', 'getAllComments', {accessToken, filter: commentsFilter}),
        this.callServiceClient('community', 'getFullProfile', {accessToken, uid: userId, profileFilter}),
        this.callServiceClient('community', 'countComments', {accessToken, where: commentsWhere}),
        this.callServiceClient('community', 'countPosts', {accessToken, where: postsWhere})
      ])
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response, query) {
    let posts = (JSON.parse(response[0].body) || []).map((post) => {
      post.type = 'post';
      post.timeCreated = post.timeCreated || '2016-03-03T12:49:19.000Z';
      post.imageSrc = false;

      if (post.group && post.group.coverImage) {
        post.imageSrc = `/billede/${post.group.coverImage.id}/small`;
      }

      if (post.owner && post.owner.image && post.owner.image.id) {
        post.owner = assignToEmpty(post.owner, {
          image: '/billede/' + post.owner.image.id + '/small'
        });
      }
      else {
        post.owner.image = '/no_profile.png';
      }

      if (post.image && post.image.id) {
        post.image = `/billede/${post.image.id}/small`;
      }

      return post;
    });

    let comments = (JSON.parse(response[1].body) || []).map((comment) => {
      comment.type = 'comment';
      comment.timeCreated = comment.timeCreated || '2001-01-01T12:00:00.000Z';
      comment.imageSrc = false;

      if (comment.post && comment.post.group && comment.post.group.coverImage) {
        comment.imageSrc = `/billede/${comment.post.group.coverImage.id}/small`;
      }

      if (comment.owner && comment.owner.image && comment.owner.image.id) {
        comment.owner.image = `/billede/${comment.owner.image.id}/small`;
      }
      else if (comment.owner) {
        comment.owner.image = '/no_profile.png';
      }

      if (comment.post && comment.post.owner && comment.post.owner.image && comment.post.owner.image.id) {
        comment.post.owner.image = `/billede/${comment.post.owner.image.id}/small`;
      }
      else if (comment.post && comment.post.owner) {
        comment.post.owner.image = '/no_profile.png';
      }

      if (comment.post && comment.post.image && comment.post.image.id) {
        comment.post.image = `/billede/${comment.post.image.id}/small`;
      }

      if (comment.image && comment.image.id) {
        comment.image = `/billede/${comment.image.id}/small`;
      }

      return comment;
    });

    let feed = posts.concat(comments);
    feed.sort((a, b) => {
      if ((new Date(a.timeCreated)) > (new Date(b.timeCreated))) {
        return -1;
      }
      else if ((new Date(a.timeCreated)) < (new Date(b.timeCreated))) {
        return 1;
      }
      return 0;
    });

    let profile = JSON.parse(response[2].body || '{}');
    delete profile.username;
    delete profile.favoriteLibrary;
    delete profile.email;
    delete profile.phone;
    delete profile.created;
    delete profile.lastUpdated;
    delete profile.hasFilledInProfile;
    delete profile.birthday;
    delete profile.fullName;

    if (profile.image) {
      profile.image.url = {
        small: '/billede/' + profile.image.id + '/small',
        medium: '/billede/' + profile.image.id + '/medium',
        large: '/billede/' + profile.image.id + '/large'
      };
    }
    else {
      profile.image = {
        url: {
          small: '/no_profile.png',
          medium: '/no_profile.png',
          large: '/no_profile.png'
        }
      };
    }

    let count = {
      commentsTotal: JSON.parse(response[3].body).count,
      postsTotal: JSON.parse(response[4].body).count,
      comments: comments.length + (query.offset || 0),
      posts: posts.length + (query.offset || 0)
    };

    return {
      body: {feed, profile, count},
      statusCode: response[0].statusCode,
      statusMessage: response[0].statusMessage
    };
  }
};

export default getUserFeedTransform;
