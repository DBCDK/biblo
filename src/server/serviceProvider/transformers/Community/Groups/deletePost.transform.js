const DeletePostTransform = {
  event() {
    return 'deletePost';
  },

  requestTransform(event, query, connection) {
    if (connection.request.session.passport) {
      // If user is logged in create the post
      const passport = connection.request.session.passport;
      const params = {
        id: query.id,
        accessToken: passport.user.id
      };

      return this.callServiceClient('community', 'deletePost', params);
    }
    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query, connection) {
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method deletePost failed');
    }
    return JSON.parse(response.body);
  }
};

export default DeletePostTransform;
