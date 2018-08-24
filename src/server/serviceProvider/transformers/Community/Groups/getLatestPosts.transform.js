import parsePost from '../../../parsers/post.parser';

const GetLatestPostsTransform = {

  event() {
    return 'getLatestPosts';
  },

  requestTransform(event, {skip, limit=10}, connection) { // eslint-disable-line no-unused-vars
    const postFilter = {
      limit: limit,
      skip: skip,
      where: {markedAsDeleted: null},
      order: 'id DESC',
      include: [
        'likes',
        'group',
        'pdf',
        'image', {
          owner: ['image']
        },
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
              }]
          }
        }
      ]
    };

    return Promise.all([
      this.callServiceClient('cached/short/community', 'getPosts', {filter: postFilter}),
      this.callServiceClient('cached/standard/community', 'getReviewCampaigns'),
      this.callServiceClient('cached/standard/community', 'getGroupCampaigns')
    ]);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getLatestPosts failed');
    }

    const campaigns = response[1].concat(response[2].body);
    const posts = JSON.parse(response[0].body);
    return posts.map(post => parsePost(post, campaigns));
  }
};

export default GetLatestPostsTransform;
