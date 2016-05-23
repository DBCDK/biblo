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
      ]
    };

    return this.callServiceClient('community', 'getComments', {id, filter: commentFilter});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getComments failed');
    }

    const comments = JSON.parse(response.body).map(comment => parseComment(comment));
    return comments;
  }
};

export default GetCommentsTransform;
