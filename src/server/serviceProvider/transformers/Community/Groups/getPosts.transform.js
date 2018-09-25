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
              }
            ]
          }
        }
      ],
      where: {postid: post.id}
    };

    return this.callServiceClient('community', 'getComments', {
      id: post.id,
      filter: commentFilter
    }).then(response => {
      post.comments = JSON.parse(response.body);
      post.numberOfCommentsLoaded = skip + limit;
      return post;
    });
  },
  // eslint-disable-next-line no-unused-vars
  requestTransform(event, {id, skip, limit, where = {}}, connection) {
    if (!id) {
      return Promise.reject(new Error('No group id provided'));
    }

    const postFilter = {
      limit: limit,
      skip: skip,
      counts: 'comments',
      where: Object.assign({groupid: id, markedAsDeleted: null}, where),
      order: 'timeCreated DESC',
      include: [
        'image',
        {
          owner: ['image']
        },
        'pdf',
        'likes',
        {
          relation: 'review',
          scope: {
            include: [
              'image',
              'likes',
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
              }
            ]
          }
        }
      ]
    };

    return Promise.all([
      this.callServiceClient('community', 'getPosts', {id, filter: postFilter}),
      this.callServiceClient('community', 'getReviewCampaigns'),
      this.callServiceClient('community', 'getGroupCampaigns')
    ]);
  },
  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query, connection) {
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getPosts failed');
    }

    const campaigns = response[1].concat(response[2].body);
    const posts = JSON.parse(response[0].body);
    return Promise.all(
      posts.map(post =>
        this.fetchCommentsForPost(post).then(postWithComments => parsePost(postWithComments, campaigns))
      )
    ).catch(err => ({errors: [err]}));
  }
};

export default GetPostsTransform;
