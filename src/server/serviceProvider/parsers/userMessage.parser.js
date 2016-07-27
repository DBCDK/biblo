/**
 * @file: This file contains the user message parser, which returns an object from an array of messages
 */

/**
 * This function parses user messages.
 * During parsing it is ensured that only accepted messages are sent to client.
 * Accepted messages with empty markAsDeleted are filtered using the acceptedMessageTypes array
 *
 * @param {Array} items
 * @param {Number} limit
 * @returns {{unreadMessages: number, messages: Array}}
 */
export function userMessageParser(items = [], limit) {
  let userMessages = {
    unreadMessages: 0,
    messages: []
  };

  if (limit) {
    items = items.slice(0, limit);
  }

  items.forEach((message) => {
    message.type = message.messageType;

    try {
      message = Object.assign(message, JSON.parse(message.message));
      delete message.message;
    }
    catch (err) {
      message.errors = ['Could not parse message'];
    }

    const accecptedMessageTypes = [
      'type-orderExpiresSoon',
      'type-orderIsReady',
      'type-userTransaction',
      'type-commentWasAdded'
    ];

    if (!!message.markAsDeleted || !accecptedMessageTypes.includes(message.messageType)) {
      return;
    }

    userMessages.messages.push(message);

    if (!message.read) {
      userMessages.unreadMessages += 1;
    }
  });

  return userMessages;
}
