const GetGenresTransform = {
  event() {
    return 'getGenres';
  },

  requestTransform(event, {}, connection) {
    return new Promise((resolve, reject) => {
      this.callServiceClient('cached/standard/community', 'getGenres')
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  responseTransform(response, {}) {
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method getGenres failed');
    }
    const genres = JSON.parse(response.body);

    return {
      status: response.statusCode,
      data: genres,
      errors: response.errors || []
    };
  }
};

export default GetGenresTransform;
