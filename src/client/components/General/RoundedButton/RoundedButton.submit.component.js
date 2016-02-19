'use strict';

import React from 'react';
import './_roundedbutton.submit.component.scss';

const RoundedButtonSubmit = ({clickFunction, buttonText}) => {
  return (
    <input className="rounded-button-submit" onClick={clickFunction} type='submit' value={buttonText} />
  );
};

RoundedButtonSubmit.displayName = 'RoundedButton.submit.component';

RoundedButtonSubmit.propTypes = {
  buttonText: React.PropTypes.string.isRequired,
  clickFunction: React.PropTypes.func
};

RoundedButtonSubmit.defaultProps = {
  clickFunction: () => {}
};

export default RoundedButtonSubmit;
