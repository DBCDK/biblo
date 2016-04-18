/**
 * @file: Search reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {
  isVisible: false
};

export default function searchReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.TOGGLE_SEARCH_BOX:
      return assignToEmpty(state, {isVisible: !state.isVisible});
    default:
      return state;
  }
}
