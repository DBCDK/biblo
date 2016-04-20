import request from 'request';

function promiseRequest(method, req) {
  return new Promise((resolve, reject) => {
    request[method](req, (err, httpResponse) => {
      if (err) {
        reject(err, httpResponse);
      }
      else {
        resolve(httpResponse);
      }
    });
  });
}

function search(endpoint, {q}) {
  const options = {
    url: `${endpoint}search/`,
    form: {q},
    headers: {
      Authorization: 'Bearer qwerty'
    }
  };
  return promiseRequest('get', options);
}


/**
 * Setting the necessary paramerters for the client to be usable.
 * The endpoint is only set if endpoint is null to allow setting it through
 * environment variables.
 *
 * @param {Object} config Config object with the necessary parameters to use
 * the webservice
 */
export default function OpenPlatformClient(config = null) {

  if (!config || !config.endpoint) {
    throw new Error('Expected config object but got null or no endpoint provided');
  }

  return {
    search: search.bind(null, config.endpoint)
  };
}
