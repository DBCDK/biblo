'use strict';

import React from 'react';
import './_roundedbutton.submit.component.scss';

export default class RoundedButtonSubmit extends React.Component {
  render() {
    return (
      <input className="rounded-button-submit" onClick={this.props.clickFunction} type='submit' value={this.props.buttonText} />
    );
  }
}

RoundedButtonSubmit.displayName = 'RoundedButton.submit';

RoundedButtonSubmit.propTypes = {
  buttonText: React.PropTypes.string.isRequired,
  clickFunction: React.PropTypes.func
};

RoundedButtonSubmit.defaultProps = {
  clickFunction: () => {}
};
