import {userMessageParser} from '../../parsers/userMessage.parser';

/**
 * @file: This file contains the getUserMessage transform which gets and parses the user messages for displaying.
 * @type {{event: (function()), requestTransform: (function(*, *=, *=)), responseTransform: (function(*))}}
 */

const GetUserMessageTransform = {
  event() {
    return 'getUserMessages';
  },

  requestTransform(event, userId, connection) {
    if (!userId && connection) {
      const user = connection.request.user || {id: '', profileId: ''};
      userId = user.profileId;
    }

    return this.callServiceClient('aws', 'getUserMessages', userId);
  },

  responseTransform(response) {
    response.messages = userMessageParser(response.Items || [], 0);
    return response;
  }
};

export default GetUserMessageTransform;
