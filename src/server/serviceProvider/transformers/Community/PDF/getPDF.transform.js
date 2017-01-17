/**
 * @file: Gets a file object containing a pdf.
 */

const getPdfTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getPDF';
  },

  /**
   *
   * @param event
   * @param id
   * @returns {Promise}
   */
  requestTransform(event, {id}) {
    return this.callServiceClient('community', 'getPostPdf', {id});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    return {body: response.body.pdf, statusCode: 200, statusMessage: 'OK'};
  }
};

export default getPdfTransform;
