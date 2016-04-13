/**
 * @file: Profile reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {hest: 1};

export default function reviewReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.CREATE_REVIEW:
      return assignToEmpty(state,
        {
          review: action.review
        });
    case types.UPDATE_REVIEW:
      return assignToEmpty(state, {
        review: action.review
      });
    default:
      return state;
  }
}
