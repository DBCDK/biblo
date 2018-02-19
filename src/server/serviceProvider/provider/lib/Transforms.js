/**
 * @file
 * Module for registering all transforms
 */

import isArray from 'lodash/isArray';
import {now} from './Utils.js';
import {manager} from './ClientCache';
import {log} from 'dbc-node-logger';

/**
 * Validate the transform object.
 *
 * @param {Object} transform
 * @return {Object}
 * @throws {Error}
 * @api public
 */
function validateTransform(transform) {
  if (!transform.event) {
    throw new Error('No event method not found on transform');
  }

  if (!transform.requestTransform) {
    throw new Error('No requestTransform method not found on transform');
  }

  if (!transform.responseTransform) {
    throw new Error('No responseTransform method not found on transform');
  }
  return transform;
}

/**
 *
 * @param transform
 * @param clients
 * @param logger
 * @returns {trigger}
 */
export default function Transform(transform, clients) {
  validateTransform(transform);
  transform.clients = clients;
  transform.logger = log;

  /**
   *
   * @deprecated
   * Call the clients directly through the clients object. this.clients.clientName.method(params);
   *
   * @param client
   * @param method
   * @param params
   * @returns {*}
   */
  transform.callServiceClient = function callServiceClient(client, method, params) {
    return clients[client][method](params);
  };

  /**
   * Trigger request on a transform
   *
   * @param params
   * @param context
   * @param callback
   */
  transform.trigger = function trigger(params, context) {
    const requestStart = now();
    const event = transform.event();
    const request = transform.requestTransform(event, params, context);
    const requests = isArray(request) && request || [request];
    return requests.map((requestPromise) => {
      return requestPromise
        .then((response) => {
          const transformedResponse = transform.responseTransform(response, params, context);
          const requestStop = now();
          log.log('info', 'Transform has been triggered', {
            event: event,
            timing: requestStop - requestStart,
            params: params
            /* Do not log `response` objects
             * as these sometimes include large data,
             * - especially with mobilsoeg-profile transforms -
             * which has a bad performance impact
             * when the logger tries to serialise it.
            //serviceReponse: response,
            //finalResponse: transformedResponse
             */
          });
          return transformedResponse;
        });
    });
  };

  transform.invalidateCache = function invalidateCache(arg) {
    return new Promise((resolve) => {
      try {
        manager.keys(arg, (keysErr, rows) => {
          if (keysErr) {
            console.error('error while looking for keys in cachestore', keysErr); // eslint-disable-line no-console
          }

          if (rows && rows.length) {
            manager.del(rows, (delErr) => {
              if (delErr) {
                console.error('error while deleting keys from cachestore', delErr); // eslint-disable-line no-console
              }
              resolve();
            });
          }
          else {
            resolve();
          }
        });
      }
      catch (e) {
        log.error(e);
        resolve();
      }
    });
  };

  return transform;
}
