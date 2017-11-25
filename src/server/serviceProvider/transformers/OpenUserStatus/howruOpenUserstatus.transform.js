/**
 * @file
 * Event for doing a howru check on OpenAgency
 */

const HowRUOpenUserstatus= {

  event() {
    return 'howruOpenUserStatus';
  },

  async requestTransform() {
    return this.callServiceClient('custom', 'howruOpenstatus');
  },

  responseTransform(response) {
    return response.statusCode >= 200 && response.statusCode < 400;
  }
};

export default HowRUOpenUserstatus;
