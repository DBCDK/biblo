/**
 * @file: Agency reducer
 */

import assignToEmpty from '../Utils/assign';
import {GET_LIBRARY_DETAILS} from '../Constants/action.constants';

const initialState = {
  errorStateObject: {}
};

export default function entitySuggestReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case GET_LIBRARY_DETAILS: {
      const agencyId = action.pickupAgency.isil || `DK-${action.pickupAgency.branchId}`;
      const newState = {
        [agencyId]: action.pickupAgency
      };
      return assignToEmpty(state, newState);
    }

    default: {
      return state;
    }
  }
}
