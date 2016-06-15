/**
 * @file
 * Setup service provicer
 */

import {Provider, AutoRequire, ClientCache} from 'dbc-node-serviceprovider';
import path from 'path';

// import clients
import Borchk from 'dbc-node-borchk';
import CommunityClient from 'dbc-node-community-client';
import EntitySuggest from 'dbc-node-entitysuggest';
import OpenAgency from 'dbc-node-openagency-client';
import OpenPlatformClient from './clients/openplatform.client.js';
import BibloAdminClient from './clients/bibloadmin.client';
import AWSClient from './clients/amazon.client';
import OpenOrder from 'dbc-node-openorder-client';
import OpenUserStatus from 'dbc-node-openuserstatus-client';

/**
 * Helper function for registering service clients. If cachetime is defined in config, wrap methods with the
 * client cache manager
 *
 * @param provider
 * @param config
 * @param clientCache
 * @param clientName
 * @param client
 */
function registerServiceClient(provider, config, clientCache, clientName, client) {
  const methods = client(config[clientName]);
  const cache = config[clientName].cache || null;
  if (cache) {
    provider.registerServiceClient(clientName, clientCache(methods, cache));
  }
  else {
    provider.registerServiceClient(clientName, methods);
  }
}

/**
 * Method for initializing all service clients and transforms
 *
 * @param config
 * @param logger
 * @param sockets
 * @returns {Provider}
 */
export default function initProvider(config, logger, sockets) {
  const provider = Provider(logger);
  provider.dispatcher(sockets);

  const RegisterClientOnProvider = registerServiceClient.bind(null, provider, config.provider.services, ClientCache(config.cache));

  // Register all clients
  RegisterClientOnProvider('borchk', Borchk);
  RegisterClientOnProvider('community', CommunityClient.bind(null, logger));
  RegisterClientOnProvider('openplatform', OpenPlatformClient);
  RegisterClientOnProvider('bibloadmin', BibloAdminClient);
  RegisterClientOnProvider('entitysuggest', EntitySuggest);
  RegisterClientOnProvider('openagency', OpenAgency);
  RegisterClientOnProvider('openorder', OpenOrder);
  RegisterClientOnProvider('openuserstatus', OpenUserStatus);
  RegisterClientOnProvider('aws', AWSClient);

  // Transforms are autorequired to lessen boilerplate code
  AutoRequire(path.join(__dirname, 'transformers'), 'transform.js')
    .map((transformObject) => provider.registerTransform(transformObject.default));

  return provider;
}
