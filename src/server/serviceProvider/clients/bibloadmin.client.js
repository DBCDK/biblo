/**
 * @file: Client for Biblo Admin
 */

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

let callBibloAdmin = function callBibloAdmin(user, password, method, req) {
  return promiseRequest(method, Object.assign(
    {
      auth: {
        user,
        password
      }
    },
    req
  ));
};

function getMenu(endpoint, {name}) {
  const options = {
    url: `${endpoint}/menu/${name}?_format=json`
  };

  return callBibloAdmin('get', options);
}

/**
 * Gets content from contentpage in json format.
 * @param endpoint
 * @param slug
 */
function getContentPage(endpoint, {slug}) {
  const options = {
    url: `${endpoint}${slug}?_format=json`
  };

  return callBibloAdmin('get', options);
}

function howru(endpoint) {
  const options = {
    url: `${endpoint}`
  };

  return promiseRequest('get', options);
}

function getCampaigns(endpoint) { // eslint-disable-line no-unused-vars
  const mockCampaignData = [{
    id: 1,
    campaignName: 'Sommerbogen 2016',
    workTypes: ['book', 'literature', 'audiobook'],
    startDate: '2016-06-09T20:00:00.044Z',
    endDate: '2016-08-21T04:00:00.044Z',
    logos: {
      svg: '/sommerbogen-logo.svg',
      small: '/sommerbogen-logo.png',
      medium: '/sommerbogen-logo.png',
      large: '/sommerbogen-logo.png'
    }
  }];

  return Promise.resolve(mockCampaignData);
}

/**
 * Setting the necessary paramerters for the client to be usable.
 * The endpoint is only set if endpoint is null to allow setting it through
 * environment variables.
 *
 * @param {Object} config Config object with the necessary parameters to use
 * the webservice
 */
export default function BibloAdminClient(config = null) {
  if (!config) {
    throw new Error('Expected config object but got null!');
  }
  else if (!config.endpoint) {
    throw new Error('Expected endpoint in config, but none provided');
  }
  else if (!config.user) {
    throw new Error('Expected user in config, but none provided');
  }
  else if (!config.password) {
    throw new Error('Expected password in config, but none provided');
  }

  callBibloAdmin = callBibloAdmin.bind(null, config.user, config.password);

  return {
    getContentPage: getContentPage.bind(null, config.endpoint),
    getCampaigns: getCampaigns.bind(null, config.endpoint),
    getMenu: getMenu.bind(null, config.endpoint),
    howru: howru.bind(null, config.endpoint)
  };
}

