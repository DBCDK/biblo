/**
 * @file: In this file we process user messages to send them to dynamo.
 */
import {log} from 'dbc-node-logger';

/**
 * This function processes user messages to insert them into DynamoDB
 * In order to create the user messages you must provide userId, messageType and message in the job object.
 * @param {Object} job
 * @param {function} done
 * @returns {Promise}
 */
export function processUserMessage(job, done) {
  return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
    const app = job.app;
    const docClient = app.get('dynamoDocClient');
    const TableName = app.get('dynamoTable');

    if (!(job.data && job.data.userId && job.data.messageType && job.data.message)) {
      return reject(new Error('Invalid user message, ensure userId, messageType and message is available in job data!'));
    }

    job.data.userId = '' + job.data.userId;
    job.data.message.created = Date.now();

    // Normalize inputs
    const messageType = job.data.messageType.indexOf('type-') === 0 ? job.data.messageType : `type-${job.data.messageType}`;
    const userId = job.data.userId.indexOf('user_') === 0 ? job.data.userId : `user_${job.data.userId}`;

    const parameters = {
      TableName,
      Item: {
        messageType: messageType,
        createdEpoch: Date.now(),
        message: JSON.stringify(job.data.message),
        userId: userId
      },
      ReturnValues: 'NONE'
    };

    log.info('Creating user message with following parameters', parameters);

    docClient.put(parameters, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  }).then((res) => done(null, res), (err) => done(err, null));
}
