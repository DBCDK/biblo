/**
 * @file: This file contains the user message parser, which returns an object from an array of messages
 */

/**
 * This function parses user messages.
 * @param {Array} items
 * @returns {{unreadMessages: number, messages: Array}}
 */
export function userMessageParser(items = [], limit = 15) {
  let userMessages = {unreadMessages: 0, messages: []};

  if (limit) {
    items = items.slice(0, limit);
  }

  items.forEach((item) => {
    item.Messages.forEach((message) => {
      message.type = item.messageType;
      userMessages.messages.push(message);

      if (!message.read) {
        userMessages.unreadMessages += 1;
      }
    });
  });

  return userMessages;
}
