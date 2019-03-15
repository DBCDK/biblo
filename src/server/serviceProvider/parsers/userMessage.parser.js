/**
 * @file: This file contains the user message parser, which returns an object from an array of messages
 */
import DeleteMessageTransform from '../transformers/UserMessages/deleteUserMessage.transform';

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

  let seenCommentIds = [];
  let seenMessageIds = [];

  items.forEach(message => {
    message.type = message.messageType;

    try {
      message = Object.assign(message, JSON.parse(message.message));
      if (message.messageType !== 'type-messageFromAdmin') {
        delete message.message;
      }
    } catch (err) {
      message.errors = ['Could not parse message'];
    }

    const accecptedMessageTypes = [
      'type-orderExpiresSoon',
      'type-orderIsReady',
      'type-userTransaction',
      'type-commentWasAdded',
      'type-userWasQuarantined',
      'type-messageFromAdmin'
    ];

    if (
      seenCommentIds.includes(message.commentId) ||
      !!message.markAsDeleted ||
      !accecptedMessageTypes.includes(message.messageType)
    ) {
      seenCommentIds.includes(message.commentId)
        ? DeleteMessageTransform.requestTransform('deleteUserMessage', message)
        : '';
      return;
    }
    if (
      (message.messageType === 'type-messageFromAdmin' || message.messageType === 'type-userWasQuarantined') &&
      seenMessageIds.includes(message.id)
    ) {
      DeleteMessageTransform.requestTransform('deleteUserMessage', message);
      return;
    }
    userMessages.messages.push(message);
    message.commentId ? seenCommentIds.push(message.commentId) : seenMessageIds.push(message.id);

    if (!message.read) {
      userMessages.unreadMessages += 1;
    }
  });

  return userMessages;
}
