/**
 * @file: Upload an image to the community service
 */
const imageUploadTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'uploadimage';
  },

  /**
   *
   * @param {string} event
   * @param {int} id
   * @param {string} size
   * @returns {Promise}
   */
  requestTransform(event, query) {
    const {image, accessToken} = query;
    query.image = 'Binary image data!';

    return this.callServiceClient('community', 'uploadImage', {image, accessToken});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {data: response.body, statusCode: response.statusCode, errors: []};
  }
};

export default imageUploadTransform;
