/**
 * @file
 * Get content page from biblo admin
 */
const HowRUAdmin = {

  /**
   * @return {string}
   */
  event() {
    return 'howruAdmin';
  },

  /**
   *
   * @param event
   * @param slug
   * @returns {Promise}
   */
  async requestTransform() {
    return this.callServiceClient('bibloadmin', 'howru');
  },

  responseTransform(response) {
    return response.statusCode >= 200 && response.statusCode < 400;
  }
};

export default HowRUAdmin;
