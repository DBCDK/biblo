const StoreQuizResultTransform = {
  event() {
    return 'getQuizResults';
  },

  requestTransform(event, {userId}, connection) {
    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;
      const params = {
        ownerId: userId,
        accessToken: passport.user.id
      };

      if (!userId) {
        return Promise.reject(new Error('Missing param "userId"'));
      }

      return this.callServiceClient('community', 'getQuizResults', params);
    }
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response) {
    const data = JSON.parse(response.body).map(r => {
      return {
        quizId: r.quizId,
        result: Object.assign({created: r.created}, r.result)
      };
    });
    return {
      status: response.statusCode,
      data,
      errors: response.errors || []
    };
  }
};

export default StoreQuizResultTransform;
