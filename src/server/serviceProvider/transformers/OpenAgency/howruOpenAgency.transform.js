/**
 * @file
 * Event for doing a howru check on OpenAgency
 */

const HowRUOpenAgency = {

  event() {
    return 'howruOpenAgency';
  },

  async requestTransform() {
    return this.callServiceClient('custom', 'howruOpenAgency');
  },

  responseTransform(response) {
    return response.statusCode >= 200 && response.statusCode < 400;
  }
};

export default HowRUOpenAgency;
