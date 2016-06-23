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
    let data = {body: {}, errors: [], statusCode: 200, statusMessage: 'OK'};

    try {
      let contentResponse = JSON.parse(response.body);
      let ContentPageLeft = [];

      if (contentResponse && contentResponse.field_content) {
        ContentPageLeft = (Array.isArray(contentResponse.field_content) ?
            contentResponse.field_content : [contentResponse.field_content]).map(contentField => {

            let widgetName;
            let widgetConfig = {};

            if (contentField.text) {
              widgetName = 'ContentPageTextWidget';
              widgetConfig.content = contentField.text;
            }
            else if (contentField.image) {
              widgetName = 'ContentPageImageWidget';
              widgetConfig.alt = contentField.image.alt;
              widgetConfig.title = contentField.image.title;
              widgetConfig.src = contentField.image.original;
            }
            else if (contentField.embedded_video) {
              widgetName = 'ContentPageEmbeddedVideoWidget';
              widgetConfig.src = contentField.embedded_video.url;
              widgetConfig.type = contentField.embedded_video.type;
            }

            return {
              widgetName,
              widgetConfig
            };
          }) || [];
      }

      if (contentResponse.title) {
        ContentPageLeft.unshift({
          widgetName: 'ContentPageTextWidget',
          widgetConfig: {
            content: `<h2>${contentResponse.title}</h2>`
          }
        });
      }

      data.body = {widgetLocations: {ContentPageLeft}, title: contentResponse.title};
    }
    catch (err) {
      data.errors.push(err);
      data.statusCode = 500;
      data.statusMessage = 'ERROR';
    }

    return data;
  }
};

export default getContentPageTransform;
