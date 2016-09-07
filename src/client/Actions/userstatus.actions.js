/**
 * @file
 * Actions for communicating with OpenUserStatus
 */

import {USERSTATUS_RENEW_LOAN} from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const renewLoanSocket = SocketClient('renewLoan');
const renewLoanListener = once(renewLoanSocket.response);

export function renewLoan(response) {
  return {
    type: USERSTATUS_RENEW_LOAN,
    response
  };
}

export function asyncRenewLoan(id) {
  return (dispatch) => {
    renewLoanListener((response) => dispatch(renewLoan(response)));

    renewLoanSocket.request({id: id});
  };
}
