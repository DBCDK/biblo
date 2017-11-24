/**
 * @file
 * Helpers for fetching data for the global content as menus.
 */

/**
 * Contains fetched content.
 *
 * @type {{reloadTime: number, globalContent: {}}}
 */
let globalContentWrapper = {
  reloadTime: 0,
  globalContent: {}
};

/**
 * Fetches global content from admin
 *
 * @param req
 * @returns {*}
 * @private
 */
function fetchGlobalContent(req) {
  return Promise.all([req.callServiceProvider('getGlobalContent', 'main'), req.callServiceProvider('getGlobalContent', 'footer')]).then(response => {
    const globalContent = {
      menu: {
        main: response[0][0],
        footer: response[1][0]
      }
    };
    globalContentWrapper = {
      reloadTime: Date.now() + (60 * 1) * 1000,
      globalContent
    };
  });
}

/**
 * Get global content and saves in local variable
 *
 * @param req
 * @param cb
 */
export default async function getGlobalContent(req, cb) {

  // First time content is loaded, wait for it to finish
  if (globalContentWrapper.reloadTime === 0) {
    await fetchGlobalContent(req);
  }
  // Update content every minut, but do it async.
  else if (globalContentWrapper.reloadTime < Date.now()) {
    fetchGlobalContent(req);
  }
  cb(globalContentWrapper.globalContent);
}
