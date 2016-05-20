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

function getCampaigns(endpoint) {
  const mockCampaignData = [{
    id: 1,
    campaignName: 'Sommerbogen 2016',
    workTypes: ['book', 'literature'],
    startDate: '2016-01-16T15:06:53.044Z',
    endDate: '2016-06-16T15:06:53.044Z',
    logos: {
      small: 'http://placekitten.com/200/200',
      medium: 'http://placekitten.com/512/512',
      large: 'http://placekitten.com/1024/1024'
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
    getCampaigns: getCampaigns.bind(null, config.endpoint)
  };
}

