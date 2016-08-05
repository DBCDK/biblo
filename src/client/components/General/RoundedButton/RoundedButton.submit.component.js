import React from 'react';
import './_roundedbutton.submit.component.scss';

const RoundedButtonSubmit = ({clickFunction, buttonText, disabled}) => {
  return (
    <input
      className={`rounded-button-submit${disabled ? ' disabled' : ''}`}
      onClick={clickFunction}
      type='submit'
      value={buttonText}
      disabled={disabled}
    />
  );
};

RoundedButtonSubmit.displayName = 'RoundedButton.submit.component';

RoundedButtonSubmit.propTypes = {
  buttonText: React.PropTypes.string.isRequired,
  clickFunction: React.PropTypes.func,
  disabled: React.PropTypes.bool
};

RoundedButtonSubmit.defaultProps = {
  clickFunction: () => {},
  disabled: false
};

export default RoundedButtonSubmit;
