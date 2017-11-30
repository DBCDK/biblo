/**
 * @file
 * Event for doing a howru check on OpenAgency
 */

const HowRUEntitySuggest = {

  event() {
    return 'howruEntitySuggest';
  },

  async requestTransform() {
    try {
      return await this.callServiceClient('custom', 'howruEntitySuggest');
    }
    catch (e) {
      console.error(e); // eslint-disable-line
      return {statusCode: 404};
    }
  },

  responseTransform(response) {
    return response.statusCode >= 200 && response.statusCode < 400;
  }
};

export default HowRUEntitySuggest;
