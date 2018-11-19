import * as types from '../Constants/action.constants';
import request from 'superagent';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import load from 'load-script';
const storeQuizResult = SocketClient('storeQuizResult');
const getQuizResult = SocketClient('getQuizResult');
const getQuizResults = SocketClient('getQuizResults');

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

const sendQuizStats = (quizId, type, subtype, quizLibraryUrl, openPlatformToken) => {
  return new Promise((resolve, reject) => {
    load(quizLibraryUrl, err => {
      if (err) {
        return reject(err);
      }
      try {
        // eslint-disable-next-line no-undef
        openPlatformQuiz.statisticsEvent({
          openPlatformToken,
          quizId,
          type,
          subtype
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
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
const getResultsForUser = userId => {
  return new Promise(resolve => {
    getQuizResults.request({userId});
    const event = getQuizResults.response(response => {
      resolve(response.data || null);
      event.off();
    });
  });
};
const saveResultForUser = async (quizId, result, libraryId, quizLibraryUrl, openPlatformToken) => {
  try {
    await sendQuizStats(quizId, 'agency', libraryId, quizLibraryUrl, openPlatformToken);
    const prevResult = await getResultForUser(quizId);
    if (shouldSaveResult(prevResult, result)) {
      storeQuizResult.request({
        quizId,
        result,
        libraryId
      });
    }
  } catch (e) {
    throw 'Der skete en fejl da quiz-resultatet skulle gemmes.';
  }
};

export function asyncInitializeQuiz(quizId, {userIsLoggedIn, favoriteLibrary, openPlatformToken}, quizLibraryUrl) {
  return async dispatch => {
    const action = {
      type: types.SET_QUIZ,
      quiz: {
        id: quizId,
        completed: false,
        result: null
      }
    };

    try {
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
          await saveResultForUser(
            quizId,
            sessionResult,
            favoriteLibrary && favoriteLibrary.libraryId,
            quizLibraryUrl,
            openPlatformToken
          );
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
    } catch (error) {
      dispatch({
        type: types.SET_QUIZ,
        quiz: {
          id: quizId,
          error
        }
      });
    }
  };
}

export function asyncSaveQuizResult(
  quizId,
  result,
  {userIsLoggedIn, favoriteLibrary, openPlatformToken},
  quizLibraryUrl
) {
  return async dispatch => {
    try {
      if (userIsLoggedIn) {
        await saveResultForUser(
          quizId,
          result,
          favoriteLibrary && favoriteLibrary.libraryId,
          quizLibraryUrl,
          openPlatformToken
        );
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
    } catch (error) {
      dispatch({
        type: types.SET_QUIZ,
        quiz: {
          id: quizId,
          error
        }
      });
    }
  };
}

export function asyncGetResultsForUser({id}) {
  return async dispatch => {
    (await getResultsForUser(id)).forEach(quizResult =>
      dispatch({
        type: types.SET_QUIZ,
        quiz: {
          id: quizResult.quizId,
          completed: true,
          result: quizResult.result
        }
      })
    );
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
