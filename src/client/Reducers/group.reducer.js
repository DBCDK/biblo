'use strict';

/**
 * @file: Group reducer
 */

import assignToEmpty from '../Utils/assign';
import {SAVE_GROUP} from '../Constants/action.constants';

const initialState = {
  name: ''
};

export default function groupReducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case SAVE_GROUP:
      return assignToEmpty(state, {
        name: action.name
      });

    default:
      return state;
  }
}
