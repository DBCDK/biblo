/* eslint-disable no-use-before-define */

/**
 * @file Actions for handling data related to the SP work endpoint
 */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import request from 'superagent';

const checkOrderPolicySocket = SocketClient('checkOrderPolicy');
const getWorksSocket = SocketClient('work');

/**
 * Async method to retreive one or more works associated with the given list of pids
 *
 * @param pids {Array} A list of pids
 */
export function asyncGetWorks(pids) {
  return (dispatch) => {
    getWorksSocket.response((response) => dispatch(getWorks(response)));

    // cancel the eventlistener after response -- this is a potentiel memoryleak
    getWorksSocket.response = () => {
    };

    getWorksSocket.request({pids: pids, fields: ['coverUrlFull', 'dcTitle', 'dcTitleFull', 'pid', 'workType']});
  };
}

/**
 * @param response {Object}
 * @return {{type, response: Object}}
 */
export function getWorks(response) {
  return {
    type: types.GET_WORK_METADATA_FOR_PERSONAL_REVIEWS,
    response
  };
}

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
      .end((err, res) => {
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
