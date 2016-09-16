/**
 * @file: This file contains the HardDeleteMessageTransform transform which request a message to be delted from AWS DynamoDB.
 * @type {{event: (()), requestTransform: ((event:String, message:PlainObject)=>*), responseTransform: ((response, message))}}
 */

const HardDeleteUserMessage = {
  event() {
    return 'hardDeleteUserMessage';
  },

  /**
   *
   * @param {String} event
   * @param {PlainObject} message - must contain createdEpoch and messageType.
   * @returns {*}
   */
  requestTransform(event, message, connect) {
    console.log(connect.session.passport);
    // return this.callServiceClient('aws', 'hardDeleteUserMessage', message);
    return new Promise().reject('testing...');
  },

  responseTransform(response, message) {
    if (response.statusCode && response.statusCode >= 400) {
      return {errors: ['Error in response from dynamo!'], response};
    }

    return {data: 'OK', message};
  }
};

export default HardDeleteUserMessage;
