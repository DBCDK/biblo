'use strict';

import React from 'react';
import './_roundedbutton.a.component.scss';

const RoundedButton = ({clickFunction, href, buttonText}) => {
  return (
    <a className="rounded-button" onClick={clickFunction} href={href}>{buttonText}</a>
  );
};

RoundedButton.displayName = 'RoundedButton.a.component';

RoundedButton.propTypes = {
  buttonText: React.PropTypes.string.isRequired,
  clickFunction: React.PropTypes.func,
  href: React.PropTypes.string
};

RoundedButton.defaultProps = {
  clickFunction: () => {},
  href: '#'
};

export default RoundedButton;
