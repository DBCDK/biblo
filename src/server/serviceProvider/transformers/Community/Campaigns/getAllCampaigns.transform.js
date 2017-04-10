/**
 * @file: Get campaigns from biblo admin.
 */
const getAllCampaignsTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getAllCampaigns';
  },

  /**
   * @returns {Promise}
   */
  requestTransform() {
    return Promise.all([
      this.callServiceClient('cached/short/community', 'getReviewCampaigns'),
      this.callServiceClient('cached/short/community', 'getGroupCampaigns')
    ]);
  },

  /**
   * @param {Array} response
   * @return {Object}
   */
  responseTransform(response) {
    const reviewCampaigns = response[0];
    const groupsCampaigns = response[1].body;

    return {
      body: reviewCampaigns.concat(groupsCampaigns),
      statusCode: response[1].statusCode
    };
  }
};

export default getAllCampaignsTransform;
