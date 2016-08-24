
const DeleteGroupTransform = {

  event() {
    return 'deleteGroup';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars

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
    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method deleteGroup failed');
    }
    return JSON.parse(response.body);
  }
};

export default DeleteGroupTransform;
