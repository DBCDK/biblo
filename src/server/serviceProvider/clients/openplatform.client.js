import request from 'request';
/**
 * Map containing anonymous and library authenticated tokens.
 *
 * @type {Map}
 */
const tokens = new Map();


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
function authenticate(config, {username = '@', password = '@'}) {
  const req = {
    url: `${config.smaug}oauth/token`,
    form: {
      grant_type: 'password',
      username: username,
      password: password
    },
    auth: {
      user: config.clientId,
      pass: config.clientSecret
    }
  };
  return promiseRequest('post', req).then((smaugResp) => {
    const token = JSON.parse(smaugResp.body);
    if (token.error) {
      return Promise.reject(token.error_description);
    }
    return token;

  });
}

/**
 * Generic method for making request to openplatform authenticated with either anonymous or library users.
 *
 * @param config
 * @param method
 * @param req
 * @param authUser
 * @returns {*}
 */
let callOpenPlatform = async function callOpenPlatform(config, method, req, authUser = '@') {
  try {
    const resp = await promiseRequest(method, Object.assign(
      {headers: {Authorization: tokens.get(authUser)}},
      req
    ));
    // Check if call was successful
    if (resp.statusCode === 401 && resp.statusMessage === 'Unauthorized') {
      // It was not, request new token
      const token = await authenticate(config, {username: authUser, password: authUser});
      tokens.set(authUser, `Bearer ${token.access_token}`);
      // Make request with new token
      return await promiseRequest(method, Object.assign(
        {headers: {Authorization: tokens.get(authUser)}},
        req
      ));
    }
    return resp;
  }
  catch (e) {
    return Promise.reject(e);
  }
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

/**
 * Check if material is available at library.
 *
 * @param endpoint
 * @param params
 * @returns {*}
 */
function availability(endpoint, params) {

  const authUser = `@${params.libraryId}`;
  const req = {
    url: `${endpoint}availability/`,
    qs: {pid: params.pids}
  };

  return callOpenPlatform('get', req, authUser);
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
  else if (!config.smaug) {
    throw new Error('Expected smaug url in config, but none provided');
  }
  else if (!config.clientId) {
    throw new Error('Expected clientId in config, but none provided');
  }
  else if (!config.clientSecret) {
    throw new Error('Expected clientSecret in config, but none provided');
  }

  tokens.set('@', config.token);
  callOpenPlatform = callOpenPlatform.bind(null, config);

  return {
    search: search.bind(null, config.endpoint),
    suggest: suggest.bind(null, config.endpoint),
    work: work.bind(null, config.endpoint),
    order: order.bind(null, config.endpoint),
    authenticate: authenticate.bind(null, config),
    availability: availability.bind(null, config.endpoint)
  };
}
