/**
 * @file: Wraps the external quiz widget
 */

import React from 'react';
import load from 'load-script';
import PropTypes from 'prop-types';

export class ExternalQuizWrapper extends React.Component {
  componentDidMount() {
    this.initializeQuiz();
  }

  initializeQuiz() {
    load(this.props.quizLibraryUrl, err => {
      if (err && !this.state.error) {
        if (this.props.onError) {
          this.props.onError();
        }
      } else {
        // eslint-disable-next-line no-undef
        this.quiz = new openPlatformQuiz.Widget({
          elemId: this.props.elementId,
          openPlatformToken: this.props.openPlatformToken,
          quizId: this.props.quizId,
          onDone: this.props.onDone
        });
      }
    });
  }

  render() {
    return <div className="quiz-widget" id={this.props.elementId} />;
  }
}

ExternalQuizWrapper.propTypes = {
  elementId: PropTypes.string.isRequired,
  onError: PropTypes.func,
  openPlatformToken: PropTypes.string.isRequired,
  quizId: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
  quizLibraryUrl: PropTypes.string.isRequired
};

export default ExternalQuizWrapper;
