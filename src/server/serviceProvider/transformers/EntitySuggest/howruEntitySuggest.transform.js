/**
 * @file
 * Event for doing a howru check on OpenAgency
 */

const HowRUEntitySuggest = {

  event() {
    return 'howruEntitySuggest';
  },

  async requestTransform() {
    return this.callServiceClient('custom', 'howruEntitySuggest');
  },

  responseTransform(response) {
    return response.statusCode >= 200 && response.statusCode < 400;
  }
};

export default HowRUEntitySuggest;
