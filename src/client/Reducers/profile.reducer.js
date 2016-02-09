'use strict';

/**
 * @file: For now, this is a dummy profile reducer
 * @TODO: Implement actual profile in reducer
 */

import assignToEmpty from '../Utils/assign';
import {CHANGE_PROFILE_AGE, CHANGE_PROFILE_USERNAME} from '../Constants/action.constants';

const initialState = {
  username: 'bob',
  age: 10
};

export default function profileReducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case CHANGE_PROFILE_AGE:
      return assignToEmpty(state, {
        age: action.age
      });

    case CHANGE_PROFILE_USERNAME:
      return assignToEmpty(state, {
        username: action.name
      });

    default:
      return state;
  }
}
