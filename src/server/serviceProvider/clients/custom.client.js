import {promiseRequest} from './../../utils/promiseRequest.util';

/**
 * Making a GET request against the OpenUserstatus endpoint
 *
 * @param {object} config
 * @return {Promise}
 */
function howruOpenstatus(config) {
  return promiseRequest('get', config.endpoint);
}

/**
 * Requesting the WSDL form OpenAgency
 *
 * @param {object} config
 * @return {Promise}
 */
function howruOpenAgency(config) {
  return promiseRequest('get', config.wsdl);
}

/**
 * Making a GET request against the EntitySuggest endpoint
 *
 * @param {object} config
 * @return {Promise}
 */
function howruEntitySuggest(config) {
  return promiseRequest('get', `${config.endpoint}/status`);
}

/**
 * Setting the necessary paramerters for the client to be usable.
 * The endpoint is only set if endpoint is null to allow setting it through
 * environment variables.
 *
 * @param {Object} config Config object with the necessary parameters to use
 * the webservice
 */
export default function CustomClient(config = null) {

  if (!config) {
    throw new Error('Expected config object but got null');
  }

  return {
    howruOpenstatus: howruOpenstatus.bind(null, config.openuserstatus),
    howruOpenAgency: howruOpenAgency.bind(null, config.openagency),
    howruEntitySuggest: howruEntitySuggest.bind(null, config.entitysuggest)
  };
}
