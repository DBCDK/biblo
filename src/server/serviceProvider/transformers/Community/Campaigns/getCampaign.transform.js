/**
 * @file: Get campaigns from biblo admin.
 */
const getContentPageTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getCampaign';
  },

  /**
   * @returns {Promise}
   */
  requestTransform(event, {id, filter={}}) {
    return this.callServiceClient('cached/short/community', 'getCampaign', {id, filter});
  },

  /**
   * @param {Array} response
   * @return {Object}
   */
  responseTransform(response) {
    return {
      body: response.body,
      statusCode: response.statusCode,
      statusMessage: 'OK'
    };
  }
};

export default getContentPageTransform;
