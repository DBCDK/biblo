const FlagGroupTransform = {
  event() {
    return 'flagGroup';
  },

  requestTransform(event, query, connection) {
    if (connection.request.session.passport) {
      // If user is logged in create the post
      const passport = connection.request.session.passport;
      const params = {
        groupId: query.flag.contentId,
        flagger: query.flag.flagger,
        description: query.flag.cause,
        accessToken: passport.user.id
      };
      return this.callServiceClient('community', 'flagGroup', params);
    }

    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: []};
  }
};

export default FlagGroupTransform;
