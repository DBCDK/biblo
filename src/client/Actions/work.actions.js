/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import request from 'superagent';

const checkOrderPolicySocket = SocketClient('checkOrderPolicy');

export function asyncCheckOrderPolicy(pids) {
  return (dispatch) => {
    checkOrderPolicySocket.response((pid) => dispatch(checkOrderPolicy(pid)));

    pids.forEach((pid) => {
      checkOrderPolicySocket.request({pids: pid});
    });
  };
}

export function checkOrderPolicy(pid) {
  return {
    type: types.CHECK_ORDER_POLICY,
    pid
  };
}

export function asyncOrderWork(pid) {
  return dispatch => {
    dispatch(orderingWork());
    request
      .post('/materiale/bestil')
      .send({mediaType: pid})
      .set('Accept', 'application/json')
      .end(function(err, res){
        dispatch(orderWork(res.body.orderPlaced, res.body.errors || []));
      });
  };
}

export function orderingWork() {
  return {
    type: types.WORK_IS_ORDERING
  };
}

export function orderWork(orderPlaced, errors) {
  return {
    type: types.WORK_HAS_ORDERED,
    orderPlaced,
    errors
  };
}
