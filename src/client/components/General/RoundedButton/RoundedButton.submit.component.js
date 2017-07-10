import React from 'react';
import PropTypes from 'prop-types';
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
  buttonText: PropTypes.string.isRequired,
  clickFunction: PropTypes.func,
  disabled: PropTypes.bool
};

RoundedButtonSubmit.defaultProps = {
  clickFunction: () => {},
  disabled: false
};

export default RoundedButtonSubmit;
