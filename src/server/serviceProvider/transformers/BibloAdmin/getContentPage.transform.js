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

  getArticleLocations(contentResponse) {
    const ContentPageFactBox = contentResponse.field_secondary_content || [];
    let ContentPageLeft = [];

    if (contentResponse.field_content) {
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
          else if (contentField.widgetName && contentField.widgetConfig) {
            // @TODO: Once all admins are deployed we can remove a bunch of the above logic.
            widgetName = contentField.widgetName;
            widgetConfig = contentField.widgetConfig;

            if (contentField.widgetConfig.medium) {
              widgetConfig.src = contentField.widgetConfig.medium;
            }
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

    return {ContentPageLeft, ContentPageFactBox};
  },

  getSectionLocations(contentResponse) {
    const SectionPage = contentResponse.field_content || [];

    if (contentResponse.title) {
      SectionPage.unshift({
        widgetName: 'ContentPageTextWidget',
        widgetConfig: {
          content: `<h2>${contentResponse.title}</h2>`
        }
      });
    }

    return {SectionPage};
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    let data = {body: {}, errors: [], statusCode: 200, statusMessage: 'OK'};

    try {
      const contentResponse = JSON.parse(response.body) || {};
      const widgetLocations = contentResponse.type === 'article' ? this.getArticleLocations(contentResponse) : this.getSectionLocations(contentResponse);
      data.body = {widgetLocations, title: contentResponse.title};
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
