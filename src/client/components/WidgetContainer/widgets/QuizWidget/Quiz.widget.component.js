/**
 * @file: Implementation of the quiz widget.
 */

import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';

import * as quizActions from '../../../../Actions/quiz.actions';

import RoundedButton from '../../../General/RoundedButton/RoundedButton.a.component';
import SimpleButton from '../../../General/SimpleButton/SimpleButton.component';
import ExternalQuizWrapper from './ExternalQuizWrapper.component';

import './scss/Quiz.widget.component.scss';

const LoginPrompt = () => {
  return (
    <div className="login-prompt">
      <h3>Log ind for at gemme resultatet på din profil</h3>
      <RoundedButton href={`/login?destination=${encodeURIComponent(window.location)}`} buttonText="Log ind" />
    </div>
  );
};
const QuizResult = ({quiz, onRetryClick}) => {
  if (!quiz || !quiz.result || quiz.completedNow || quiz.retry) {
    return null;
  }
  let message = '';
  const trophy = quiz.result.trophy && quiz.result.trophy.image;
  if (quiz.storedAfterLogin) {
    message = 'Resultatet er nu blevet gemt på din profil';
  } else if (quiz.completed) {
    message = 'Du har prøvet quizzen før. Vil du prøve igen?';
  }
  return (
    <div className="quiz-result">
      {trophy && (
        <div className="trophy-wrapper">
          <img src={trophy} />
        </div>
      )}
      <h3>{message}</h3>
      <div className="bottom">
        <span>
          <SimpleButton className="retry-button" text="Prøv igen" onClick={onRetryClick} />
        </span>
      </div>
    </div>
  );
};
QuizResult.propTypes = {
  quiz: PropTypes.object,
  onRetryClick: PropTypes.func.isRequired
};

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      done: false
    };
  }

  componentDidMount() {
    const {actions, quizId, profileState, quizLibraryUrl} = this.props;
    actions.asyncInitializeQuiz(quizId, profileState, quizLibraryUrl);
  }

  onDone = result => {
    const {actions, quizId, profileState, quizLibraryUrl} = this.props;
    actions.asyncSaveQuizResult(quizId, result, profileState, quizLibraryUrl);
  };

  onError = () => {
    this.setState({error: true});
  };

  retry = () => {
    const {actions, quizId} = this.props;
    actions.retryQuiz(quizId);
  };

  render() {
    const {quizId, quiz, profileState, quizLibraryUrl} = this.props;
    const error = this.state.error || (this.props.quiz && this.props.quiz.error);

    if (!quiz) {
      return null;
    }
    if (error) {
      return (
        <div className="quiz-widget-error">
          <h3>{typeof error === 'string' ? error : 'Quizzen kunne desværre ikke indlæses korrekt'}</h3>
        </div>
      );
    }
    const showQuiz = !quiz.completed || quiz.completedNow || quiz.retry;
    const promptLogin = quiz.completed && !profileState.userIsLoggedIn;

    return (
      <div className="quiz-widget">
        {showQuiz ? (
          <ExternalQuizWrapper
            quizId={quizId}
            openPlatformToken={profileState.openPlatformToken}
            onError={this.onError}
            elementId={this.props.elementId}
            onDone={this.onDone}
            quizLibraryUrl={quizLibraryUrl}
          />
        ) : (
          <QuizResult quiz={quiz} onRetryClick={this.retry} />
        )}
        {promptLogin && <LoginPrompt />}
      </div>
    );
  }
}
Quiz.propTypes = {
  quizId: PropTypes.string.isRequired,
  quiz: PropTypes.object,
  elementId: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  profileState: PropTypes.object.isRequired,
  quizLibraryUrl: PropTypes.string.isRequired
};
const QuizConnected = connect(
  (state, ownProps) => {
    return {
      profileState: state.profileReducer,
      quiz: state.quizReducer.quizzes[ownProps.quizId],
      quizLibraryUrl: state.quizReducer.quizLibraryUrl
    };
  },
  dispatch => {
    return {
      actions: bindActionCreators(quizActions, dispatch)
    };
  }
)(Quiz);

/**
 * This is a thin wrapper around the redux connected quiz (QuizConnected).
 * It adheres to the widget API by extending the AbstractWidget
 * Its main responsibility is to retrieve quizId and inject it into QuizConnected
 */
export class QuizWidget extends AbstractWidget {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.widgetConfig.quizId, this.props.widgetConfig.quizId);
  }
  render() {
    return <QuizConnected quizId={this.props.widgetConfig.quizId} elementId={`quiz-${this.props.widgetIndex}`} />;
  }
}
