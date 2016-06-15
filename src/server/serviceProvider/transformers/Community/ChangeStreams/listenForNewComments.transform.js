const listenForNewCommentsTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'listenForNewComments';
  },

  /**
   *
   * @param {String} event
   * @param {Function} cb
   * @returns {Promise}
   */
  requestTransform(event, cb) {
    if (cb.length > 0 && typeof cb[0] !== 'function') {
      return Promise.reject({errors: ['Argument is not an array of functions!']});
    }
    else if (!Array.isArray(cb) && typeof cb !== 'function') {
      return Promise.reject({errors: ['Argument not a function!']});
    }

    return this.callServiceClient('community', 'listenForNewComments', cb);
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: response, statusCode: 200, statusMessage: 'OK'};
  }
};

export default listenForNewCommentsTransform;
