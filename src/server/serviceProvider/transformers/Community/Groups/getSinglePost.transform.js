'use strict';

const GetPostsTransform = {

  event() {
    return 'getSinglePosts';
  },

  requestTransform(event, {id}, connection) { // eslint-disable-line no-unused-vars

    const postFilter = {
      where: {id},
      include: ['image', 'likes']
    };

    return this.callServiceClient('community', 'getPosts', {filter: postFilter});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getPosts failed');
    }

    const posts = JSON.parse(response.body);
    return posts[0] || null;
  }
};

export default GetPostsTransform;
