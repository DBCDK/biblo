'use strict';

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
    return comments[0];
  }
};

export default GetSingleCommentsTransform;
