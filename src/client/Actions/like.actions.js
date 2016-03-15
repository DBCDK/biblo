'use strict';

/**
 * @file: feed actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const likePostSocketClient = SocketClient('likePost');
const unlikePostSocketClient = SocketClient('unlikePost');

export function likePost(like) {
  likePostSocketClient.request({
    profileId: like.profileId,
    postId: like.postId
  });
  return {
    type: types.LIKE_POST,
    profileId: like.profileId,
    postId: like.postId
  };
}

export function unlikePost(like) {
  unlikePostSocketClient.request({like});
  return {
    type: types.UNLIKE_POST
  };
}
