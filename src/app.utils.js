/**
 * @file: This file contains helper functions for the app in general.
 */

import Queue from 'bull';
import {config} from '@dbcdk/biblo-config';

/**
 * This is a helper function to create a bull queue
 * @param {dbc-node-logger}logger
 * @param {Express}app
 * @param {PlainObject}redisConfig
 * @param {String}queueName
 * @param {Function}processFunction
 * @returns {bull.Queue}
 */
export function createQueue(logger, app, queueName, processFunction) {
  const redisHost = config.get('Redis.host');
  const redisPort = config.get('Redis.port');
  const redisPrefix = config.get('Redis.queue_prefix');
  const genericQueue = Queue(`${redisPrefix}${queueName}`, `redis://${redisHost}:${redisPort}`, {});

  genericQueue.process((job, done) => {
    job.app = app;
    return processFunction(job, done);
  });

  genericQueue.on('error', error => {
    logger.error(`An error occurred in ${queueName} queue`, error);
  });

  genericQueue.on('failed', (job, error) => {
    logger.error(`A job failed in ${queueName} queue`, {job, error});
  });

  return genericQueue;
}

