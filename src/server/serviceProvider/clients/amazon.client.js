/**
 * @file: Client for AWS.
 */

import {config} from '@dbcdk/biblo-config';
import AWS from 'aws-sdk';
import ProxyAgent from 'proxy-agent';

/**
 * Gets a users messages from dynamo db
 * @param docClient
 * @param tableName
 * @param userId
 * @returns {Promise}
 */
function getUserMessages(docClient, tableName, userId) {
  return new Promise((resolve, reject) => {
    const parameters = {
      TableName: tableName,
      IndexName: 'uderId-message-index',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': `user_${userId}`
      }
    };

    docClient.scan(parameters, (err, data) => {
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
 * Marks a message as read.
 * @param docClient
 * @param {String} tableName
 * @param {String} messageType
 * @param {Number} createdEpoch
 */
function setUserMessageRead(docClient, tableName, {messageType, createdEpoch}) {
  return new Promise((resolve, reject) => {
    if (!(messageType && createdEpoch)) {
      reject('Not enough parameters! Please ensure messageType and createdEpoch is set.');
    }

    const parameters = {
      TableName: tableName,
      Key: {
        messageType: messageType.indexOf('type-') === 0 ? messageType : `type-${messageType}`,
        createdEpoch
      },
      AttributeUpdates: {
        read: {
          Action: 'PUT',
          Value: Date.now()
        }
      }
    };

    docClient.update(parameters, (err, data) => {
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
 *  Delete a message.
 * @param docClient
 * @param {String} tableName
 * @param {String} messageType
 * @param {Number} createdEpoch
 */
function deleteUserMessage(docClient, tableName, {messageType, createdEpoch}) {
  return new Promise((resolve, reject) => {
    if (!(messageType && createdEpoch)) {
      reject('Not enough parameters! Please ensure messageType and createdEpoch is set.');
    }

    const parameters = {
      TableName: tableName,
      Key: {
        messageType: messageType.indexOf('type-') === 0 ? messageType : `type-${messageType}`,
        createdEpoch
      },
      AttributeUpdates: {
        markAsDeleted: {
          Action: 'PUT',
          Value: Date.now()
        }
      }
    };

    docClient.update(parameters, (err, data) => {
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
  const KAFKA_TOPIC = config.get('Logger.KAFKA_TOPIC');
  const ENV = process.env.NODE_ENV || 'development'; // eslint-disable-line no-process-env
  const tableName = config.get('ServiceProvider.aws.DynamoDB.tableName') || `biblo_${ENV}_${KAFKA_TOPIC}_message_table`;

  // Create the document client
  const dynamodb = new AWS.DynamoDB({apiVersion: config.get('ServiceProvider.aws.DynamoDB.apiVersion')});
  const docClient = new AWS.DynamoDB.DocumentClient({service: dynamodb});

  return {
    setUserMessageRead: setUserMessageRead.bind(null, docClient, tableName),
    getUserMessages: getUserMessages.bind(null, docClient, tableName),
    deleteUserMessage: deleteUserMessage.bind(null, docClient, tableName)
  };
}
