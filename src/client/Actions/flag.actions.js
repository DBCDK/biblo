/**
 * @file: feed actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const flagPostSocketClient = SocketClient('flagPost');
const flagGroupSocketClient = SocketClient('flagGroup');
const flagCommentSocketClient = SocketClient('flagComment');
const flagReviewSocketClient = SocketClient('flagReview');


export function flagPost(flag) {
  flagPostSocketClient.request({flag});

  return {
    type: types.FLAG_POST
  };
}

export function flagComment(flag) {
  flagCommentSocketClient.request({flag});

  return {
    type: types.FLAG_COMMENT
  };
}

export function flagGroup(flag) {
  flagGroupSocketClient.request({flag});

  return {
    type: types.FLAG_GROUP
  };
}

export function flagReview(flag) {
  flagReviewSocketClient.request({flag});

  return {
    type: types.FLAG_REVIEW
  };
}
