import request from 'request';
let token = 'Bearer bobby'; // invalid by default, this value gets overwritten by config, but is useful for debugging.

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

let callOpenPlatform = function callOpenPlatform(config, method, req) {
  // First try a normal call with the token we have
  return promiseRequest(method, Object.assign(
    {headers: {Authorization: token}},
    req
  )).then((resp) => {
    // Check if call was successful
    if (resp.statusCode === 401 && resp.statusMessage === 'Unauthorized') {
      // It was not, request new token
      return promiseRequest('post', {
        url: `${config.smaug}oauth/token`,
        form: {
          grant_type: 'password',
          username: '@',
          password: '@'
        },
        auth: {
          user: config.clientId,
          pass: config.clientSecret
        }
      }).then((smaugResp) => {
        const smaugBody = JSON.parse(smaugResp.body);
        if (!smaugBody.access_token) {
          throw new Error('Error in response from smaug, is you clientId/clientSecret set correctly?');
        }

        token = `Bearer ${smaugBody.access_token}`;

        // Try call again with new token.
        return promiseRequest(method, Object.assign(
          {headers: {Authorization: token}},
          req
        ));
      });
    }

    return resp;
  });
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

/**
 * Create order
 *
 * @param {String} endpoint
 * @param {Object} params
 */
function order(endpoint, params) {
  const req = {
    url: `${endpoint}order/`,
    headers: {
      Authorization: params.token,
      'content-type': 'application/json'
    },
    body: JSON.stringify(params.request)
  };

  return promiseRequest('post', req);
}

function suggest(endpoint, params) {
  const options = {
    url: `${endpoint}suggest/`,
    qs: params
  };

  return callOpenPlatform('get', options);
}


/**
 * Requesting an authenticated access token.
 *
 * If params gives a valid client and user, a token is returned. Else an error is thrown.
 *
 * @param {Object} config
 * @param {Object} params
 *
 * @returns {String}
 *
 * @throws Error
 */
function authenticate(config, {userId, libraryId, password}) {
  return promiseRequest('post', {
    url: `${config.smaug}oauth/token`,
    form: {
      grant_type: 'password',
      username: `${userId}@${libraryId}`,
      password: password
    },
    auth: {
      user: config.clientId,
      pass: config.clientSecret
    }
  }).then((smaugResp) => {
    const smaugBody = JSON.parse(smaugResp.body);
    if (smaugBody.error) {
      throw new Error(smaugBody.error_description);
    }
    return smaugBody;
  });
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
  else if (!config.smaug) {
    throw new Error('Expected smaug url in config, but none provided');
  }
  else if (!config.clientId) {
    throw new Error('Expected clientId in config, but none provided');
  }
  else if (!config.clientSecret) {
    throw new Error('Expected clientSecret in config, but none provided');
  }

  token = config.token;
  callOpenPlatform = callOpenPlatform.bind(null, config);

  return {
    search: search.bind(null, config.endpoint),
    suggest: suggest.bind(null, config.endpoint),
    work: work.bind(null, config.endpoint),
    order: order.bind(null, config.endpoint),
    authenticate: authenticate.bind(null, config)
  };
}
