/* eslint-disable no-use-before-define */

/**
 * @file Actions for handling data related to the SP work endpoint
 */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import request from 'superagent';
import {once} from 'lodash';

const checkOrderPolicySocket = SocketClient('checkOrderPolicy');
const getWorksSocket = SocketClient('work');
const getWorksListener = once(getWorksSocket.response);

/**
 * Async method to retreive one or more works associated with the given list of pids
 *
 * @param pids {Array} A list of pids
 */
export function asyncGetWorks(pids) {
  return (dispatch) => {
    getWorksListener((response) => dispatch(getWorks(response)));

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

/**
 * Get online access urls for pids
 * (only do this for pids actually getting ordered)
 *
 * note: hasOnlineAccess is currently not on collectionDetails on the /work endpoint
 * @param pids
 */
export function asyncGetWorkOnlineAccess(pids) {
  return (dispatch) => {
    getWorksSocket.response((response) => dispatch(getWorkOnlineAccess(response)));

    getWorksSocket.response = () => {
    };

    getWorksSocket.request({pids: pids, fields: ['pid', 'hasOnlineAccess']});
  };
}

export function getWorkOnlineAccess (response) {
  return {
    type: types.GET_WORK_ONLINEACCESS,
    response
  };
}

export function asyncCheckOrderPolicy(pids) {
  return (dispatch) => {
    checkOrderPolicySocket.response((pid) => dispatch(checkOrderPolicy(pid)));
    if (pids) {
      pids.forEach((pid) => {
        checkOrderPolicySocket.request({pids: pid});
      });
    }
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

export function resetOrderState() {
  return {
    type: types.WORK_ORDER_RESET_STATE
  };
}
