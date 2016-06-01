/**
 * @file: Client for AWS.
 */

import AWS from 'aws-sdk';
import ProxyAgent from 'proxy-agent';

function getUserMessages(docClient, tableName, userId) {
  return new Promise((resolve, reject) => {
    const parameters = {
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': `user_${userId}`
      }
    };

    docClient.query(parameters, (err, data) => {
      if (err || !data) {
        reject(err || 'No data found!');
      }
      else {
        resolve(data);
      }
    });
  });
}

/**
 * Setting the necessary paramerters for the client to be usable.
 *
 * @param {Object} config Config object with the necessary parameters to use the webservice.
 */
export default function AWSClient(config = null) {
  if (!config) {
    throw new Error('Expected config object but got null!');
  }
  else if (!config.key) {
    throw new Error('Expected key in config object but got nothing!');
  }
  else if (!config.keyId) {
    throw new Error('Expected keyId in config object but got nothing!');
  }
  else if (!config.region) {
    throw new Error('Expected region in config object but got nothing!');
  }

  // Ensure global settings are correct!
  AWS.config.update({
    region: config.region,
    accessKeyId: config.keyId,
    secretAccessKey: config.key
  });

  // Make sure we can go through the DMZ proxy.
  if (config.http_proxy) {
    AWS.config.update({
      httpOptions: {
        agent: new ProxyAgent(config.http_proxy)
      }
    });
  }

  // Figure out the table name!
  const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'local'; // eslint-disable-line no-process-env
  const ENV = process.env.NODE_ENV || 'development'; // eslint-disable-line no-process-env
  const tableName = process.env.DYNAMO_TABLE_NAME || `biblo_${ENV}_${KAFKA_TOPIC}_messages`; // eslint-disable-line no-process-env

  // Create the document client
  const docClient = new AWS.DynamoDB.DocumentClient();

  return {
    getUserMessages: getUserMessages.bind(null, docClient, tableName)
  };
}
