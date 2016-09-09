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
      console.log(response);

      return newState;
    }

    default: {
      return state;
    }
  }
}
