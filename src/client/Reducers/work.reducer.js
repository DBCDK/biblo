/**
 * @file: Profile reducer
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const initialState = {
  orderPolicy: {},
  orderState: 0,
  responses: 0,
  work: parseJsonData('JSONDATA', 'work')
};

export default function workReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.CHECK_ORDER_POLICY: {
      let newState = {
        responses: state.responses + 1,
        orderPolicy: state.orderPolicy
      };

      if (action.pid.pids && action.pid.errors && action.pid.errors.length < 1) {
        newState.orderPolicy[action.pid.pids] = action.pid.orderPossible;
      }

      return assignToEmpty(state, newState);
    }

    case types.WORK_IS_ORDERING: {
      return assignToEmpty(state, {
        orderState: 1
      });
    }

    case types.WORK_HAS_ORDERED: {
      let newOrderState = 2;

      if (action.errors && action.errors.length > 0) {
        newOrderState = 3;

        if (action.errors[0] === 'borrower_not_found') {
          newOrderState = 4;
        }
      }

      return assignToEmpty(state, {
        orderState: newOrderState
      });
    }

    default: {
      return state;
    }
  }
}
