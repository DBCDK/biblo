const DeleteGroupTransform = {
  event() {
    return 'deleteGroup';
  },

  requestTransform(event, query, connection) {
    // eslint-disable-line no-unused-vars

    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;

      if (!passport.user.profile.profile.isModerator) {
        return Promise.reject(new Error('user does not have access'));
      }

      const params = {
        id: query.id,
        accessToken: passport.user.id
      };

      return this.callServiceClient('community', 'deleteGroup', params);
    }

    return Promise.reject(new Error('user not logged in'));
  },
  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query, connection) {
    if (response.statusCode !== 200) {
      throw new Error(
        'Call to community service, with method deleteGroup failed'
      );
    }

    return JSON.parse(response.body);
  }
};

export default DeleteGroupTransform;
