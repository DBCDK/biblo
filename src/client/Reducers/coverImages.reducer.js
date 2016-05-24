/**
 * @file: CoverImages reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

/**
 * initial state before coverImages get filled in.
 */
let initialState = {
  pids: {}
};

export default function coverImageReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GOT_COVER_IMAGE_FROM_PID:
      return assignToEmpty(state, {pids: assignToEmpty(state.pids, action.coverImageResult)});

    default:
      return state;
  }
}
