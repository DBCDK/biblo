/**
 * @file: Work reducer. Handles data related to work
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const initialState = {
  availability: {},
  orderState: 0,
  responses: 0,
  work: parseJsonData('JSONDATA', 'work'),
  workMetadataOrderedByPid: {} // used to contain metadata related to one specific pid, displayed in the reviews on the /profile page. All data will be keyed by pid
};

/**
 * Work Reducer
 * @param {object} state
 * @param {{type: {string}, response: {data: {}, statusCode: {number}}}} action
 * @return {{availability: {}, orderState: number, responses: number, work: {}, workReviews: {}, workReviewsMeta: {}, workMetadataOrderedByPid: {}}}
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
          const pid = item.pid && Array.isArray(item.pid) && item.pid[0] || '';
          newState.workMetadataOrderedByPid[pid] = {
            dcTitle: item.dcTitle ? item.dcTitle : null,
            dcTitleFull: item.dcTitleFull ? item.dcTitleFull : null,
            coverUrl: item.coverUrlFull ? item.coverUrlFull[0] : null,
            workType: item.workType ? item.workType : null
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

    case types.CHECK_AVAILABILITY: {
      let newState = {
        responses: state.responses + 1,
        availability: state.availability
      };
      if (action.data.pids && !action.data.errors) {
        newState.availability[action.data.pids] = action.data.data.willLend;
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

      if (action.response.errors && action.response.errors.length > 0) {
        newOrderState = 3;

        if (action.response.errors[0] === 'User credentials are invalid') {
          newOrderState = 4;
        }
      }
      if (action.response.data && action.response.data.status && action.response.data.status !== 'ok') {
        newOrderState = 4;
      }

      return assignToEmpty(state, {
        orderState: newOrderState
      });
    }

    case types.WORK_ORDER_RESET_STATE: {
      return assignToEmpty(state, {
        orderState: 0
      });
    }

    default: {
      return state;
    }
  }
}
