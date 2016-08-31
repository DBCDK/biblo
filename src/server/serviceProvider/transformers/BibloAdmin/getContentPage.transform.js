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
    const ContentPageLeft = contentResponse.field_content || [];

    if (contentResponse.title) {
      ContentPageLeft.unshift({
        widgetName: 'ContentPageTextWidget',
        widgetConfig: {
          content: `<h1>${contentResponse.title}</h1>`
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
          content: `<h1>${contentResponse.title}</h1>`
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
