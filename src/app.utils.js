/**
 * @file: This file contains helper functions for the app in general.
 */

import Queue from 'bull';

/**
 * This is a helper function to create a bull queue
 * @param {Express} app
 * @param {PlainObject} redisConfig
 * @param {String} queueName
 * @param {Function} processFunction
 * @returns {bull.Queue}
 */
export function createQueue(app, redisConfig, queueName, processFunction) {
  const logger = app.get('logger');

  const redisPrefix = process.env.REDIS_QUEUE_PREFIX || '';
  const genericQueue = Queue(`${redisPrefix}${queueName}`, redisConfig.port, redisConfig.host);

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

