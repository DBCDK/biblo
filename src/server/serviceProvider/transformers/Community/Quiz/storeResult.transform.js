const StoreQuizResultTransform = {
  event() {
    return 'storeQuizResult';
  },

  requestTransform(event, {quizId, result, libraryId}, connection) {
    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;
      const params = {
        quizId,
        libraryId,
        ownerId: passport.user.profileId,
        accessToken: passport.user.id,
        result
      };

      if (!quizId) {
        return Promise.reject(new Error('Missing param "quizId"'));
      }
      if (!result) {
        return Promise.reject(new Error('Missing param "result"'));
      }

      return this.callServiceClient('community', 'storeQuizResult', params);
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    return {
      status: response.statusCode,
      data: response.body,
      errors: response.errors || []
    };
  }
};

export default StoreQuizResultTransform;
