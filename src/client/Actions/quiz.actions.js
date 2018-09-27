import * as types from '../Constants/action.constants';
import request from 'superagent';

const setSession = (quizId, result) => {
  return request.put('/api/session/' + quizId).send(result);
};

const getSession = quizId => {
  return request.get('/api/session/' + quizId);
};

const delSession = quizId => {
  return request.delete('/api/session/' + quizId);
};

// eslint-disable-next-line
const saveResultForUser = (quizId, result, userId) => {
  // TODO save result in CS
};

export function asyncInitializeQuiz(quizId, {userIsLoggedIn, id}) {
  return async dispatch => {
    const action = {
      type: types.SET_QUIZ,
      quiz: {
        id: quizId,
        completed: false,
        result: null
      }
    };

    let sessionResult;
    try {
      sessionResult = (await getSession(quizId)).body;
    } catch (err) {
      // swallow - nothing to do if it fails
    }

    if (sessionResult) {
      action.quiz.completed = true;
      action.quiz.result = sessionResult;

      if (userIsLoggedIn) {
        action.quiz.stored = true;
        await saveResultForUser(quizId, sessionResult, id);
        action.quiz.storedAfterLogin = true;
        await delSession(quizId);
      }
    } else if (userIsLoggedIn) {
      // console.log('user is logged in');
      // TODO if user is logged in load potential result from CS
      // action.quiz.stored = true;
      // action.quiz.result = {}; // TODO load from CS
      // action.quiz.completed = true;
    }

    dispatch(action);
  };
}

export function asyncSaveQuizResult(quizId, result, {userIsLoggedIn, id}) {
  return async dispatch => {
    if (userIsLoggedIn) {
      await saveResultForUser(quizId, result, id);
    } else {
      await setSession(quizId, result);
    }
    dispatch({
      type: types.SET_QUIZ,
      quiz: {
        id: quizId,
        completedNow: true,
        completed: true,
        result
      }
    });
  };
}

export function retryQuiz(quizId) {
  return {
    type: types.SET_QUIZ,
    quiz: {
      id: quizId,
      retry: true
    }
  };
}
