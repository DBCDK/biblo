'use strict';

/**
 * @file: Profile actions
 */
/* eslint-disable no-use-before-define */

import {GET_USER_PROFILE, CHECK_IF_DISPLAYNAME_IS_TAKEN} from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const checkIfDisplayNameIsTaken = SocketClient('checkIfDisplayNameIsTaken');
const checkIfDisplayNameIsTakenListener = once(checkIfDisplayNameIsTaken.response);

export function getProfile() {
  return {
    type: GET_USER_PROFILE
  };
}

export function asyncCheckDisplayNameExists(displayName) {
  return (dispatch) => {
    checkIfDisplayNameIsTakenListener((res) => dispatch(checkDisplayNameExists(res.data.displayname, res.data.exists)));
    checkIfDisplayNameIsTaken.request(displayName);
  };
}

export function checkDisplayNameExists(displayname, exists) {
  return {
    type: CHECK_IF_DISPLAYNAME_IS_TAKEN,
    displayname,
    exists
  };
}
