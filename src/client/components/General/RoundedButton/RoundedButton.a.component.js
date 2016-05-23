import React from 'react';
import './_roundedbutton.a.component.scss';

const RoundedButton = ({clickFunction, href, buttonText, compact, className}) => {
  return (
    <a className={(compact ? 'rounded-button--compact' : 'rounded-button') + className} onClick={clickFunction} href={href}>{buttonText}</a>
  );
};

RoundedButton.displayName = 'RoundedButton.a.component';

RoundedButton.propTypes = {
  buttonText: React.PropTypes.any.isRequired,
  clickFunction: React.PropTypes.func,
  href: React.PropTypes.string,
  compact: React.PropTypes.bool,
  className: React.PropTypes.string
};

RoundedButton.defaultProps = {
  clickFunction: () => {},
  href: '#!',
  compact: false,
  className: ''
};

export default RoundedButton;
