/**
 * @file: This transform gets a group from the community service, if a user is logged in, it also checks if that user
 *   is following the group.
 */

const HowRUTransform = {

  event() {
    return 'howru';
  },

  async requestTransform() {
    let ok = false;
    try {
      await this.callServiceClient('community', 'getStatus');
      ok = true;
    }
    catch (e) {
      console.error(e); // eslint-disable-line
    }

    return ok;
  },

  responseTransform(response) {
    return response;
  }
};

export default HowRUTransform;
