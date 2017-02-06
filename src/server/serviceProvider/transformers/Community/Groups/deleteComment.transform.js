
const deleteCommentTransform = {

  event() {
    return 'deleteComment';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;

      if (passport.user.profile.profile.isModerator) {
        return this.callServiceClient('community', 'deleteComment', {id: query.id});
      }

      return this.callServiceClient('community', 'getComments', {id: query.id, filter: {where: {id: query.id}}}).then(comment => {
        comment = JSON.parse(comment.body)[0];
        if (!comment) {
          return Promise.reject(new Error('Could not find comment to delete!'));
        }

        if (!comment.commentownerid === passport.user.profileId) {
          return Promise.reject(new Error('User does not own the comment!'));
        }

        return this.callServiceClient('community', 'deleteComment', {id: query.id});
      });
    }

    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method deletePost failed');
    }
    return JSON.parse(response.body);
  }
};

export default deleteCommentTransform;
