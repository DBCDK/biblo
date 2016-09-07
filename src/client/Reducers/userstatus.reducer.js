import {USERSTATUS_RENEW_LOAN} from '../Constants/action.constants';
import assignToEmpty from '../Utils/assign';

const initialState = {
  renewLoan: {}
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

    default: {
      return state;
    }
  }
}
