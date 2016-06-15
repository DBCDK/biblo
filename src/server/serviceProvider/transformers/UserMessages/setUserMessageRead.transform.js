/**
 * @file: This file contains the setUserMessageRead transform which sets messages as read.
 * @type {{event: (function()), requestTransform: (function(*, *=, *=)), responseTransform: (function(*))}}
 */

const SetUserMessageReadTransform = {
  event() {
    return 'setUserMessageRead';
  },

  /**
   *
   * @param {String} event
   * @param {PlainObject} message - must contain createdEpoch and messageType.
   * @returns {*}
   */
  requestTransform(event, message) {
    return this.callServiceClient('aws', 'setUserMessageRead', message);
  },

  responseTransform(response, message) {
    if (response.statusCode && response.statusCode >= 400) {
      return {errors: ['Error in response from dynamo!'], response};
    }

    return {data: 'OK', message};
  }
};

export default SetUserMessageReadTransform;
