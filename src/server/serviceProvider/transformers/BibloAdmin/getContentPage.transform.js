/**
 * @file
 * Get content page from biblo admin
 */
const getContentPageTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getContentPage';
  },

  /**
   *
   * @param event
   * @param slug
   * @returns {Promise}
   */
  requestTransform(event, slug) {
    return this.callServiceClient('bibloadmin', 'getContentPage', {slug});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    let contentResponse = JSON.parse(response.body);
    let ContentPageLeft = [];

    if (contentResponse && contentResponse.field_content) {
      ContentPageLeft = (Array.isArray(contentResponse.field_content) ?
        contentResponse.field_content : [contentResponse.field_content]).map(contentField => {

          let widgetName;
          let widgetData = {};

          if (contentField.text) {
            widgetName = 'ContentPageTextWidget';
            widgetData.content = contentField.text;
          }
          else if (contentField.image) {
            widgetName = 'ContentPageImageWidget';
            widgetData.alt = contentField.image.alt;
            widgetData.title = contentField.image.title;
            widgetData.src = contentField.image.original;
          }
          else if (contentField.embedded_video) {
            widgetName = 'ContentPageEmbeddedVideoWidget';
            widgetData.src = contentField.embedded_video.url;
            widgetData.type = contentField.embedded_video.type;
          }

          return {
            widgetName,
            widgetData
          };
        }) || [];
    }

    if (contentResponse.title) {
      ContentPageLeft.unshift({
        widgetName: 'ContentPageTextWidget',
        widgetData: {
          content: `<h2>${contentResponse.title}</h2>`
        }
      });
    }

    return {body: {widgetLocations: {ContentPageLeft}, title: contentResponse.title}, statusCode: 200, statusMessage: 'OK'};
  }
};

export default getContentPageTransform;
