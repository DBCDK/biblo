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
  requestTransform(event, type) {
    if (type === 'group') {
      return this.callServiceClient('cached/short/community', 'getGroupCampaigns');
    }

    return this.callServiceClient('cached/short/community', 'getReviewCampaigns');
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
