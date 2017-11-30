/**
 * @file
 * Event for getting an authenticated token through smaug.
 */

const HowRUOpenPlatform = {

  event() {
    return 'howruOpenPlatform';
  },

  async requestTransform() {
    return [
      await this.callServiceClient('openplatform', 'howru'),
      await this.callServiceClient('openplatform', 'howruSmaug')
    ];
  },

  responseTransform(responses) {
    return responses.map(response => response.statusCode >= 200 && response.statusCode < 400);
  }
};

export default HowRUOpenPlatform;
