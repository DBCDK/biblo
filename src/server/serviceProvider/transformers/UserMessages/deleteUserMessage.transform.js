/**
 * @file: This file contains the DeleteMessageTransform transform which sets messages as deleted.
 * @type {{event: (function()), requestTransform: (function(*, *=, *=)), responseTransform: (function(*))}}
 */

const DeleteMessageTransform = {
  event() {
    return 'deleteUserMessage';
  },

  /**
   *
   * @param {String} event
   * @param {PlainObject} message - must contain createdEpoch and messageType.
   * @returns {*}
   */
  requestTransform(event, message) {
    return this.callServiceClient('aws', 'deleteUserMessage', message);
  },

  responseTransform(response, message) {
    if (response.statusCode && response.statusCode >= 400) {
      return {errors: ['Error in response from dynamo!'], response};
    }

    return {data: 'OK', message};
  }
};

export default DeleteMessageTransform;
