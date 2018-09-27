/**
 * @file: Quiz reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const initialState = {
  quizLibraryUrl: '',
  quizzes: {}
};

if (typeof window !== 'undefined') {
  const quizLibraryUrl = document.getElementById('QUIZ_LIBRARY_URL');
  if (
    quizLibraryUrl &&
    quizLibraryUrl.innerHTML &&
    quizLibraryUrl.innerHTML.length > 0
  ) {
    initialState.quizLibraryUrl = JSON.parse(quizLibraryUrl.innerHTML);
  }
}

export default function quizReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.SET_QUIZ: {
      const quizzes = assignToEmpty(state.quizzes);
      quizzes[action.quiz.id] = assignToEmpty(
        quizzes[action.quiz.id] || {},
        action.quiz
      );
      return assignToEmpty(state, {quizzes});
    }
    default:
      return state;
  }
}
