/**
 * @file
 * Basic service provider. Discovers and initializes the transforms and
 * initializes the dispatcher if sockets are available.
 */

import Dispatcher from './lib/Dispatcher';
import Transform from './lib/Transforms';

/**
 * Initialization of the provider and the underlying services.
 *
 * @param {Object} config Object containing the necessary parameters.
 *
 * @api public
 */
export function Provider() {
  /**
   * Object with all clients registered on the provider
   * @type {{}}
   */
  const clients = {};

  /**
   * Map of all transforms registered on the provider
   * @type {Map}
   */
  const transforms = new Map();

  /**
   * Method for registering a single transform
   * @param transformObject
   */
  function registerTransform(transformObject) {
    const name = transformObject.event();
    if (transforms.has(name)) {
      throw new Error(`Event '${name}' already registered`);
    }
    const transform = Transform(transformObject, clients);
    transforms.set(name, transform);

    return transform;
  }

  /**
   * Method for registering a service client
   *
   * @param name
   * @param client
   */
  function registerServiceClient(name, client) {
    if (clients[name]) {
      throw new Error(`Client '${name}' already registered`);
    }
    clients[name] = client;

    return clients;
  }

  /**
   * Initializes the use of sockets
   *
   * go through a socket it should be provided here. Currently there's no
   * alternative to using socket.
   * @api public
   * @param io
   */
  function dispatcher(io) {
    Dispatcher(transforms, io);
  }

  function trigger(event, params, context) {
    if (!transforms.get(event)) {
      throw new Error('No such API endpoint');
    }
    return transforms.get(event).trigger(params, context);
  }

  return {
    registerTransform,
    registerServiceClient,
    dispatcher,
    trigger
  };
}
