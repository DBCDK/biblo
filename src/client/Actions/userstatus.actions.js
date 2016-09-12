/**
 * @file
 * Actions for communicating with OpenUserStatus
 */

import {USERSTATUS_RENEW_LOAN, USERSTATUS_GET_STATUS} from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const renewLoanSocket = SocketClient('renewLoan');
const renewLoanListener = once(renewLoanSocket.response);

const getUserStatusSocket = SocketClient('getUserStatus');
const getUserStatusListener = once(getUserStatusSocket.response);

function renewLoan(response) {
  return {
    type: USERSTATUS_RENEW_LOAN,
    response
  };
}

export function asyncRenewLoan(id) {
  return (dispatch) => {
    renewLoanListener((response) => {
      dispatch(getUserStatusAsync({})); // eslint-disable-line
      dispatch(renewLoan(response));
    });

    renewLoanSocket.request({id: id});
  };
}

function getUserStatus(response) {
  return {
    type: USERSTATUS_GET_STATUS,
    response
  };
}

export function getUserStatusAsync({agencyId = null, userId = null, pinCode = null}) {
  return (dispatch) => {
    getUserStatusListener((response) => dispatch(getUserStatus(response)));

    getUserStatusSocket.request({agencyId, userId, pinCode});
  };
}
