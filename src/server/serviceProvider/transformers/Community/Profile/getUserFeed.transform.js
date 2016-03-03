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
          {relation: 'post', scope: {fields: ['owner', 'id', 'content'], include: ['image']}}
        ],
        limit: 10
      };

      Promise.all([
        this.callServiceClient('community', 'getPosts', {accessToken, filter: postsFilter}),
        this.callServiceClient('community', 'getAllComments', {accessToken, filter: commentsFilter})
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
      return post;
    });

    let comments = (JSON.parse(response[1].body) || []).map((comment) => {
      comment.type = 'comment';
      comment.timeCreated = comment.timeCreated || '2001-01-01T12:00:00.000Z';
      return comment;
    });

    let feed = posts.concat(comments);
    feed.sort((a, b) => {
      if ((new Date(a.timeCreated)) < (new Date(b.timeCreated))) {
        return -1;
      }
      else if ((new Date(a.timeCreated)) > (new Date(b.timeCreated))) {
        return 1;
      }
      return 0;
    });

    return {
      body: feed,
      statusCode: response[0].statusCode,
      statusMessage: response[0].statusMessage
    };
  }
};

export default getUserFeedTransform;
