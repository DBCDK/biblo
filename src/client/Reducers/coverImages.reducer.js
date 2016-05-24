/**
 * @file: CoverImages reducer
 */

import assignToEmpty from '../Utils/assign';
import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';

/**
 * Create a widgetLocation for contentPageLeft and fill with widgets from json.
 */
let initialState = {
  pids: {}
};

export default function widgetReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GOT_COVER_IMAGE_FROM_PID:
      return assignToEmpty(state, {pids: assignToEmpty(state.pids, action.coverImageResult)});

    default:
      return state;
  }
}
