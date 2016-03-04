'use strict';

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
   * @param connection
   * @returns {Promise}
   */
  requestTransform(event, userId, connection) {
    return new Promise((resolve, reject) => {
      const user = connection.request.user || {id: ''};
      const accessToken = user.id;
      const postsFilter = {
        where: {
          postownerid: userId
        },
        include: [
          {relation: 'group', scope: {include: ['coverImage']}},
          'image'
        ],
        limit: 10
      };

      const commentsFilter = {
        where: {
          commentownerid: userId
        },
        include: [
          {
            relation: 'post',
            scope: {
              include: [{
                relation: 'group',
                scope: {
                  include: ['coverImage']
                }
              }]
            }
          },
          'image'
        ],
        limit: 10
      };

      Promise.all([
        this.callServiceClient('community', 'getPosts', {accessToken, filter: postsFilter}),
        this.callServiceClient('community', 'getAllComments', {accessToken, filter: commentsFilter}),
        this.callServiceClient('community', 'getFullProfile', {accessToken, uid: userId})
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
  responseTransform(response) {
    let posts = (JSON.parse(response[0].body) || []).map((post) => {
      post.type = 'post';
      post.timeCreated = post.timeCreated || '2016-03-03T12:49:19.000Z';
      post.imageSrc = false;

      if (post.image) {
        post.imageSrc = `/billede/${post.image.id}/small`;
      }
      else if (post.group && post.group.coverImage) {
        post.imageSrc = `/billede/${post.group.coverImage.id}/small`;
      }

      return post;
    });

    let comments = (JSON.parse(response[1].body) || []).map((comment) => {
      comment.type = 'comment';
      comment.timeCreated = comment.timeCreated || '2001-01-01T12:00:00.000Z';
      comment.imageSrc = false;

      if (comment.image) {
        comment.imageSrc = `/billede/${comment.image.id}/small`;
      }
      else if (comment.post && comment.post.image) {
        comment.imageSrc = `/billede/${comment.post.image.id}/small`;
      }
      else if (comment.post && comment.post.group && comment.post.group.coverImage) {
        comment.imageSrc = `/billede/${comment.post.group.coverImage.id}/small`;
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

    return {
      body: {feed, profile},
      statusCode: response[0].statusCode,
      statusMessage: response[0].statusMessage
    };
  }
};

export default getUserFeedTransform;
