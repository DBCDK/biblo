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

function search(endpoint, params) {
  const options = {
    url: `${endpoint}search/`,
    form: params,
    headers: {
      Authorization: 'Bearer qwerty'
    }
  };
  return promiseRequest('get', options);
}


function work(endpoint, params) {
  const options = {
    url: `${endpoint}work/`,
    form: params,
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
    search: search.bind(null, config.endpoint),
    work: work.bind(null, config.endpoint)
  };
}
