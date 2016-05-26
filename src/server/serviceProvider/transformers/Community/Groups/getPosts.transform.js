import parsePost from '../../../parsers/post.parser';

const GetPostsTransform = {

  event() {
    return 'getPosts';
  },

  fetchCommentsForPost(post, limit = 1, skip = 0) {
    const commentFilter = {
      limit: limit,
      skip: skip,
      order: 'timeCreated DESC',
      include: [
        'image',
        'review',
        {owner: ['image']},
        {
          relation: 'video',
          scope: {
            include: [
              {
                relation: 'resolutions',
                scope: {
                  include: ['video']
                }
              }]
          }
        }
      ],
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
      where: {groupid: id, markedAsDeleted: null},
      order: 'timeCreated DESC',
      include: [
        'image', {
          owner: ['image']
        },
        'likes',
        {
          relation: 'review',
          scope: {
            include: [
              'image',
              {
                relation: 'video',
                scope: {
                  include: [
                    {
                      relation: 'resolutions',
                      scope: {
                        include: ['video']
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          relation: 'video',
          scope: {
            include: [
              {
                relation: 'resolutions',
                scope: {
                  include: ['video']
                }
              }]
          }
        }
      ]
    };

    return Promise.all([
      this.callServiceClient('community', 'getPosts', {id, filter: postFilter}),
      this.callServiceClient('bibloadmin', 'getCampaigns')
    ]);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getPosts failed');
    }

    const posts = JSON.parse(response[0].body);
    return Promise.all(posts.map(post => this.fetchCommentsForPost(post)
      .then(postWithComments => parsePost(postWithComments, response[1]))));
  }
};

export default GetPostsTransform;
