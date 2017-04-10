/**
 * @file
 * Get content page from biblo admin
 */
const getGlobalContentTransform = {

  /**
   * @return {string}
   */
  event() {
    return 'getGlobalContent';
  },

  /**
   *
   * @param event
   * @param slug
   * @returns {Promise}
   */
  requestTransform(event, name) {
    return this.callServiceClient('cached/short/bibloadmin', 'getMenu', {name});
  },

  responseTransform(response) {
    if (response.statusCode === 200) {

      return JSON.parse(response.body).map(element => {
        return {
          title: element.link.title,
          url: element.link.url.uri,
          description: element.link.description,
          id: element.link.meta_data.entity_id
        };
      });
    }

    return {
      error: 'cannot get menu',
      statusCode: response.statusCode
    };
  }
};

export default getGlobalContentTransform;
