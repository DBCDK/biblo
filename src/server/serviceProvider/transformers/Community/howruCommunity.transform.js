/**
 * @file: This transform gets a group from the community service, if a user is logged in, it also checks if that user
 *   is following the group.
 */

const HowRUCommunity = {

  event() {
    return 'howruCommunity';
  },

  async requestTransform() {
    try {
      return await this.callServiceClient('community', 'howru');
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

export default HowRUCommunity;
