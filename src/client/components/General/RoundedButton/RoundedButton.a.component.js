import React from 'react';
import PropTypes from 'prop-types';
import './_roundedbutton.a.component.scss';

const RoundedButton = ({clickFunction, href, buttonText, compact, className, target=''}) => {
  // If first character in className is not a white prepend a whitespace to ensure classes are not concatenated in one single string
  if (className && className[0] !== ' ') {
    className = ' ' + className;
  }

  return (
    <a className={(compact ? 'rounded-button--compact' : 'rounded-button') + className} target={target} onClick={clickFunction} href={href}>{buttonText}</a>
  );
};

RoundedButton.displayName = 'RoundedButton.a.component';

RoundedButton.propTypes = {
  buttonText: PropTypes.any.isRequired,
  clickFunction: PropTypes.func,
  href: PropTypes.string,
  compact: PropTypes.bool,
  className: PropTypes.string,
  target: PropTypes.string
};

RoundedButton.defaultProps = {
  clickFunction: () => {},
  href: '#!',
  compact: false,
  className: ''
};

export default RoundedButton;
