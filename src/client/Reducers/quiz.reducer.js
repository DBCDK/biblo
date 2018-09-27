/**
 * @file: Quiz reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {};

export default function quizReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.SET_QUIZ: {
      const quiz = assignToEmpty(state.quiz || {}, action.quiz);
      return assignToEmpty(state, {[quiz.id]: quiz});
    }
    default:
      return state;
  }
}
