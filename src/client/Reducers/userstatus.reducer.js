import {USERSTATUS_RENEW_LOAN, USERSTATUS_GET_STATUS} from '../Constants/action.constants';
import assignToEmpty from '../Utils/assign';

const initialState = {
  renewLoan: {},
  userStatus: {}
};

export default function userstatusReducer(state = initialState, action = {}) {
  Object.freeze(state);

  switch (action.type) {
    case USERSTATUS_RENEW_LOAN: {
      const response = action.response;
      const newState = assignToEmpty(state, {});

      const loanId = response.loanId;
      newState.renewLoan[loanId] = {
        message: response.message,
        error: response.error,
        userStatusError: response.userstatusError
      };

      return newState;
    }

    case USERSTATUS_GET_STATUS: {
      const response = action.response;
      const newState = assignToEmpty(state, {});
      if ((response.errors && response.errors.length) || !response.result) {
        console.error('Error in response from OpenUserStatus', response); // eslint-disable-line
      }
      else {
        newState.userStatus = assignToEmpty(response.result, {});
      }

      return newState;
    }

    default: {
      return state;
    }
  }
}
