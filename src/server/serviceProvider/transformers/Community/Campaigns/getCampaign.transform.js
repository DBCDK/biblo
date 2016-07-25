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
  requestTransform(event, {id}) {
    return this.callServiceClient('community', 'getCampaign', {id});
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
