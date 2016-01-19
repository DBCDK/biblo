'use strict';

/**
 * @file
 * Setup service provicer
 */

import {Provider, AutoRequire, ClientCache} from 'dbc-node-serviceprovider';
import path from 'path';

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

  const RegisterClientOnProvider = registerServiceClient.bind(null, provider, config.provider.services, ClientCache(config.cache)); // eslint-disable-line

  // Register all clients
  // ...

  // Transforms are autorequired to lessen boilerplate code
  AutoRequire(path.join(__dirname, 'transformers'), 'transform.js').map(provider.registerTransform);

  return provider;
}
