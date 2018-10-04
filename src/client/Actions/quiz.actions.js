import * as types from '../Constants/action.constants';
import request from 'superagent';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const storeQuizResult = SocketClient('storeQuizResult');
const getQuizResult = SocketClient('getQuizResult');

const setSession = (quizId, result) => {
  return request.put('/api/session/' + quizId).send(result);
};

const getSession = quizId => {
  return request.get('/api/session/' + quizId);
};

const delSession = quizId => {
  return request.delete('/api/session/' + quizId);
};
const shouldSaveResult = (prevResult, result) => {
  // should save if current result is better than previous
  if (!prevResult) {
    return true;
  }
  return prevResult.score < result.score;
};
const getResultForUser = quizId => {
  return new Promise(resolve => {
    getQuizResult.request({
      quizId
    });
    const event = getQuizResult.response(response => {
      resolve((response.data && response.data[0] && response.data[0].result) || null);
      event.off();
    });
  });
};
const saveResultForUser = async (quizId, result, libraryId) => {
  const prevResult = await getResultForUser(quizId);
  if (shouldSaveResult(prevResult, result)) {
    storeQuizResult.request({
      quizId,
      result,
      libraryId
    });
  }
};

export function asyncInitializeQuiz(quizId, {userIsLoggedIn, favoriteLibrary}) {
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
        await saveResultForUser(quizId, sessionResult, favoriteLibrary && favoriteLibrary.libraryId);
        action.quiz.storedAfterLogin = true;
        await delSession(quizId);
      }
    } else if (userIsLoggedIn) {
      const storedResult = await getResultForUser(quizId);
      if (storedResult) {
        action.quiz.result = storedResult;
        action.quiz.completed = true;
        action.quiz.stored = true;
      }
    }

    dispatch(action);
  };
}

export function asyncSaveQuizResult(quizId, result, {userIsLoggedIn, favoriteLibrary}) {
  return async dispatch => {
    if (userIsLoggedIn) {
      await saveResultForUser(quizId, result, favoriteLibrary && favoriteLibrary.libraryId);
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
