/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const checkOrderPolicy = SocketClient('checkOrderPolicy');

export function asyncCheckOrderPolicy(pids) {
  return (dispatch) => {
    checkOrderPolicy.response((res) => {
      console.log(res);
    });

    pids.forEach((pid) => {
      checkOrderPolicy.request({agencyId: '775100', pids: pid});
    });
  };
}
