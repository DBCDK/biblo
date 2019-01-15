const StoreQuizResultTransform = {
  event() {
    return 'getQuizResult';
  },

  requestTransform(event, {quizId}, connection) {
    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;
      const params = {
        quizId,
        ownerId: passport.user.profileId,
        accessToken: passport.user.id
      };

      if (!quizId) {
        return Promise.reject(new Error('Missing param "quizId"'));
      }
      return this.callServiceClient('community', 'getQuizResult', params).then(response => {
        return Object.assign(response, {quizId});
      });
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {
      status: response.statusCode,
      data: JSON.parse(response.body),
      quizId: response.quizId,
      errors: response.errors || []
    };
  }
};

export default StoreQuizResultTransform;
