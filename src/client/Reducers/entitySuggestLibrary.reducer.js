'use strict';

/**
 * @file: Entity Suggest library reducer
 */

import assignToEmpty from '../Utils/assign';
import {FIND_LIBRARIES} from '../Constants/action.constants';

let initialState = {
  query: 'nil',
  nil: []
};

export default function profileReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case FIND_LIBRARIES:
      let newState = {
        query: action.query
      };
      newState[action.query] = action.elements;
      return assignToEmpty(state, newState);

    default:
      return state;
  }
}
