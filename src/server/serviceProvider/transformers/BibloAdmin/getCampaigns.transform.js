/**
 * @file: Get campaigns from biblo admin.
 */
const getContentPageTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getCampaigns';
  },

  /**
   * @returns {Promise}
   */
  requestTransform() {
    return this.callServiceClient('bibloadmin', 'getCampaigns');
  },

  /**
   * @param {Array} response
   * @return {Object}
   */
  responseTransform(response) {
    return {
      body: response,
      statusCode: 200,
      statusMessage: 'OK'
    };
  }
};

export default getContentPageTransform;
