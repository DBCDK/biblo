/**
 * @file: Work reducer. Handles data related to work
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const initialState = {
  orderPolicy: {},
  orderState: 0,
  responses: 0,
  work: parseJsonData('JSONDATA', 'work'),
  workMetadataOrderedByPid: {} // used to contain metadata related to one specific pid, displayed in the reviews on the /profile page. All data will be keyed by pid
};

/**
 * Work Reducer
 * @param state
 * @param {{response: {}, data: []}} action
 * @return {{orderPolicy: {}, orderState: number, responses: number, work: {}, workReviews: {}, workReviewsMeta: {}, workMetadataOrderedByPid: {}}}
 */
export default function workReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {

    case types.GET_WORK_METADATA_FOR_PERSONAL_REVIEWS: {
      let newState = assignToEmpty(state, {});

      // we only want to start parsing data if we got a 200 from the server
      if (action.response.statusCode === 200) {
        const data = action.response.data;

        // itereate through the returned data and key by the pid
        data.forEach((item) => {
          const pid = item.pid[0];
          newState.workMetadataOrderedByPid[pid] = {
            dcTitle: item.dcTitle ? item.dcTitle[0] : null,
            dcTitleFull: item.dcTitleFull ? item.dcTitleFull[0] : null,
            coverUrl: item.coverUrlFull ? item.coverUrlFull[0] : null,
            workType: item.workType ? item.workType[0] : null
          };
        });
      }

      return newState;
    }
    case types.GET_WORK_ONLINEACCESS: { // the /work endpoint returns hasOnlineAcces pr pid . We run this after check accessType "online"
      let newState = assignToEmpty(state, {});
      newState.work.collectionDetails.forEach((item) => {
        if (item.pid[0] === action.response.data[0].pid[0]) {
          if (action.response.data[0].hasOnlineAccess) {
            item.hasOnlineAccess = action.response.data[0].hasOnlineAccess; // get actual url
          }
        }
      });

      return state;
    }

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
