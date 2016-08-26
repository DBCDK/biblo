let globalContentWrapper = {
  reloadTime: 0,
  globalContent: {}
};

function fetchGlobalContent(req) {
  return req.callServiceProvider('getGlobalContent', 'main').then(response => {
    const globalContent = {
      menu: {
        main: response[0]
      }
    };
    globalContentWrapper = {
      reloadTime: Date.now() + (60 * 1) * 1000,
      globalContent
    };
  });
}


export default async function getGlobalContent(req, cb) {

  // First time content is loaded, wait for it to finish
  if (globalContentWrapper.reloadTime == 0) {
    await fetchGlobalContent(req);
  }
  // Update content every minut, but do it async.
  else if (globalContentWrapper.reloadTime < Date.now()) {
    fetchGlobalContent(req);
  }
  cb(globalContentWrapper.globalContent);
}


