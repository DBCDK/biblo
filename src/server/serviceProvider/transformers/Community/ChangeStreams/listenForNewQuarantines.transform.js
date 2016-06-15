/**
 * @file: Creates a listener for new quarantines
 * @type {{event: (function(): string), requestTransform: (function(String, Function): Promise), responseTransform: (function(Object): Object)}}
 */

const listenForNewQuarantinesTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'listenForNewQuarantines';
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

    return this.callServiceClient('community', 'listenForNewQuarantines', cb);
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: response, statusCode: 200, statusMessage: 'OK'};
  }
};

export default listenForNewQuarantinesTransform;
