/**
 * @file
 * Delete a profile.
 */
const deleteProfile = {

  /**
   * @return {string}
   */
  event() {
    return 'deleteProfile';
  },

  /**
   * @param {String} event
   * @param {Object} query
   */
  requestTransform(event, id) {
    return this.callServiceClient('community', 'deleteProfile', {id});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: response.body, statusCode: response.statusCode, statusMessage: response.statusMessage};
  }
};

export default deleteProfile;
