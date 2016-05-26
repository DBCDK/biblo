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
      this.callServiceClient('community', 'getPosts', {filter: Object.assign(postFilter, filter)}),
      this.callServiceClient('bibloadmin', 'getCampaigns')
    ]);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getPosts failed');
    }

    const posts = JSON.parse(response[0].body);
    return posts && parsePost(posts[0], response[1]) || null;
  }
};

export default GetPostsTransform;
