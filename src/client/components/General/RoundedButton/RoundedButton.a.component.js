'use strict';

import React from 'react';
import './_roundedbutton.a.component.scss';

const RoundedButton = ({clickFunction, href, buttonText, compact}) => {
  return (
    <a className={compact ? 'rounded-button--compact' : 'rounded-button'} onClick={clickFunction} href={href}>{buttonText}</a>
  );
};

RoundedButton.displayName = 'RoundedButton.a.component';

RoundedButton.propTypes = {
  buttonText: React.PropTypes.string.isRequired,
  clickFunction: React.PropTypes.func,
  href: React.PropTypes.string,
  compact: React.PropTypes.bool
};

RoundedButton.defaultProps = {
  clickFunction: () => {},
  href: '#',
  compact: false
};

export default RoundedButton;
