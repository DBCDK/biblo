'use strict';

const GetSingleCommentsTransform = {

  event() {
    return 'getSingleComment';
  },

  parseProfile(owner) {
    if (owner) {
      return {
        id: owner.id,
        displayName: owner.displayName,
        image: owner.image && '/billede/' + owner.image.id + '/medium' || null
      };
    }

    // All posts, groups and comments should have an owner. This is a fallback in case of mysterious events
    return {
      id: 0,
      displayName: 'Anonym',
      image: 'http://lorempixel.com/200/200/'
    };
  },

  parseComment(comment) {
    comment.owner = this.parseProfile(comment.owner);
    comment.image = comment.image && '/billede/' + comment.image.id + '/medium' || null;
    return comment;
  },

  requestTransform(event, {id}, connection) { // eslint-disable-line no-unused-vars

    const commentFilter = {
      where: {id: id},
      order: 'timeCreated DESC',
      include: ['image', {owner: ['image']}]
    };

    return this.callServiceClient('community', 'getComments', {id, filter: commentFilter});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getComments failed');
    }

    const comments = JSON.parse(response.body).map(comment => this.parseComment(comment));
    return comments[0];
  }
};

export default GetSingleCommentsTransform;
