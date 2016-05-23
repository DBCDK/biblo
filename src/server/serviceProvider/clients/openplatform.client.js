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

let callOpenPlatform = function callOpenPlatform(token, method, req) {
  return promiseRequest(method, Object.assign(
    {headers: {Authorization: token}},
    req
  ));
};

function search(endpoint, params) {
  const options = {
    url: `${endpoint}search/`,
    qs: params
  };
  return callOpenPlatform('post', options);
}

/**
 * Requesting data from endpoint based on params
 *
 * @param {String} endpoint
 * @param {Object} params
 */
function work(endpoint, params) {
  const options = {
    url: `${endpoint}work/`,
    form: params
  };
  return callOpenPlatform('post', options);
}

function suggest(endpoint, params) {
  const options = {
    url: `${endpoint}suggest/`,
    qs: params
  };

  return callOpenPlatform('get', options);
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
  if (!config) {
    throw new Error('Expected config object but got null!');
  }
  else if (!config.endpoint) {
    throw new Error('Expected endpoint in config, but none provided');
  }
  else if (!config.token) {
    throw new Error('Expected token in config, but none provided');
  }

  callOpenPlatform = callOpenPlatform.bind(null, config.token);

  return {
    search: search.bind(null, config.endpoint),
    suggest: suggest.bind(null, config.endpoint),
    work: work.bind(null, config.endpoint)
  };
}
