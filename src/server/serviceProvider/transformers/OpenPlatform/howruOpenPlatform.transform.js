/**
 * @file
 * Event for getting an authenticated token through smaug.
 */

const HowRUOpenPlatform = {

  event() {
    return 'howruOpenPlatform';
  },

  requestTransform() {
    return this.callServiceClient('openplatform', 'howru');
  },

  responseTransform(response) {
    return response.statusCode >= 200 && response.statusCode < 400;
  }
};

export default HowRUOpenPlatform;
