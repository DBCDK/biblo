import parsePost from '../../../parsers/post.parser';

const GetPostsTransform = {

  event() {
    return 'getSinglePosts';
  },

  requestTransform(event, {id, filter = {}}, connection) { // eslint-disable-line no-unused-vars

    const postFilter = {
      where: {id, markedAsDeleted: null},
      include: [
        'image',
        'pdf',
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
        {owner: ['image']},
        'likes',
        {
          relation: 'comments',
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
                    }]
                }
              },
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
      this.callServiceClient('cached/standard/community', 'getPosts', {filter: Object.assign(postFilter, filter)}),
      this.callServiceClient('cached/standard/community', 'getReviewCampaigns'),
      this.callServiceClient('cached/standard/community', 'getGroupCampaigns')
    ]);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getPosts failed');
    }

    const campaigns = response[1].concat(response[2].body);
    const posts = JSON.parse(response[0].body);
    return posts && parsePost(posts[0], campaigns) || null;
  }
};

export default GetPostsTransform;
