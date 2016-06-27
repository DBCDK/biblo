/**
 * @file
 * Transform that retreives a comment based on the given id.
 * The comments context, relation to post and group, is also retreived.
 */

import parseComment from '../../../parsers/comment.parser';

const GetSingleCommentsTransform = {

  event() {
    return 'getSingleComment';
  },

  requestTransform(event, {id}, connection) { // eslint-disable-line no-unused-vars

    const commentFilter = {
      where: {id: id},
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
        {post: ['group']},
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
      this.callServiceClient('community', 'getComments', {id, filter: commentFilter}),
      this.callServiceClient('bibloadmin', 'getCampaigns')
    ]);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response[0].statusCode !== 200) {
      throw new Error('Call to community service, with method getComments failed');
    }

    const comments = JSON.parse(response[0].body).map(comment => parseComment(comment, response[1]));
    return comments[0];
  }
};

export default GetSingleCommentsTransform;
