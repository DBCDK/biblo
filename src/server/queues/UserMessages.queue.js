/**
 * @file: In this file we process user messages to send them to dynamo.
 */

/**
 * This function processes user messages to insert them into DynamoDB
 * In order to create the user messages you must provide userId, messageType and message in the job object.
 * @param {PlainObject} job
 * @returns {Promise}
 */
export function processUserMessage(job, done) {
  return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
    const app = job.app;
    const logger = app.get('logger');
    const docClient = app.get('dynamoDocClient');
    const TableName = app.get('dynamoTable');

    if (!job.data || !job.data.userId || !job.data.messageType || !job.data.message) {
      return reject(new Error('Invalid user message, ensure userId, messageType and message is available in job data!'));
    }

    job.data.message.created = Date.now();

    const parameters = {
      TableName,
      Key: {
        userId: `user_${job.data.userId}`,
        messageType: `type-${job.data.messageType}`
      },
      UpdateExpression: 'SET Messages = list_append (:r, if_not_exists (Messages, :d))',
      ExpressionAttributeValues: {
        ':d': [],
        ':r': [job.data.message]
      },
      ReturnValues: 'UPDATED_NEW'
    };

    logger.info('Creating user message with following parameters', parameters);

    docClient.update(parameters, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  }).then((res) => done(null, res), (err) => done(err, null));
}
