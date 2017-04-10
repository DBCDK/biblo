import parseComment from '../../../parsers/comment.parser';

const GetCommentsTransform = {

  event() {
    return 'getComments';
  },

  requestTransform(event, {id, skip, limit}, connection) { // eslint-disable-line no-unused-vars

    const commentFilter = {
      limit: limit,
      skip: skip,
      counts: 'comments',
      where: {postid: id},
      order: 'timeCreated DESC',
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
      this.callServiceClient('cached/standard/community', 'getComments', {id, filter: commentFilter}),
      this.callServiceClient('cached/standard/community', 'getReviewCampaigns'),
      this.callServiceClient('cached/standard/community', 'getGroupCampaigns')
    ]);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getComments failed');
    }

    const campaigns = response[1].concat(response[2].body);
    const comments = JSON.parse(response[0].body).map(comment => parseComment(comment, campaigns));
    return comments;
  }
};

export default GetCommentsTransform;
