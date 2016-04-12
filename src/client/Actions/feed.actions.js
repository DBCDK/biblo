/**
 * @file: feed actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const getUserFeedSocketClient = SocketClient('getUserFeed');
const getUserFeedListener = once(getUserFeedSocketClient.response);

export function asyncGetUserFeed(userId, offset) {
  return (dispatch) => {
    getUserFeedListener((res) => dispatch(getUserFeed(res.body.count, res.body.feed, res.body.profile)));
    getUserFeedSocketClient.request({userId, offset});
  };
}

export function getUserFeed(count, feed, profile) {
  return {
    type: types.GET_USER_FEED,
    count,
    feed,
    profile
  };
}
