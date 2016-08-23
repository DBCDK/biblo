import profileParser from '../../../parsers/profile.parser';
import commentParser from '../../../parsers/comment.parser';
import postParser from '../../../parsers/post.parser';
import groupParser from '../../../parsers/group.parser';

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

  handleGetMyGroups(groups, userId) {
    const seenGroups = {};
    return Promise.all(
      groups
        .filter(group => {
          if (!seenGroups[group.groupid]) {
            seenGroups[group.groupid] = true;
            return true;
          }

          return false;
        })
        .map(group => this.callServiceClient('community', 'countPosts', {
          where: {
            markedAsDeleted: null,
            groupid: group.groupid,
            timeCreated: {
              gte: group.visited
            },
            postownerid: {
              neq: userId
            }
          }
        }).then(pCount => {
          const postsSinceLast = JSON.parse(pCount.body).count;
          return Object.assign(group.group, {postsSinceLast});
        })));
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
        postownerid: userId,
        markedAsDeleted: null
      };

      const postsFilter = {
        where: postsWhere,
        include: [
          {relation: 'group'},
          {relation: 'owner', scope: {include: ['image']}},
          'image',
          'likes'
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
                relation: 'group'
              }, {
                relation: 'owner',
                scope: {
                  include: ['image']
                }
              },
                'image',
                'likes'
              ]
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
        this.callServiceClient('community', 'countPosts', {accessToken, where: postsWhere}),
        this.callServiceClient('community', 'getMyGroups', {
          accessToken,
          uid: userId,
          include: {group: 'coverImage'}
        }).then(groups => this.handleGetMyGroups(groups, userId))
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
   * @param {Object} query
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

      if (post.group) {
        post.group = groupParser(post.group);
      }

      return postParser(post);
    });

    let comments = (JSON.parse(response[1].body) || []).map((comment) => {
      comment.type = 'comment';
      comment.timeCreated = comment.timeCreated || '2001-01-01T12:00:00.000Z';
      comment.imageSrc = false;
      comment.post = postParser(comment.post);

      if (comment.post.group) {
        comment.post.group = groupParser(comment.post.group);
      }

      return commentParser(comment);
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

    const profileResponse = JSON.parse(response[2].body || '{}');
    profileResponse.groups = response[5];
    const profile = profileParser(profileResponse, true, false);

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
