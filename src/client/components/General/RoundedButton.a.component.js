'use strict';

import React from 'react';
import './_roundedbutton.a.component.scss';

export default class RoundedButton extends React.Component {
  render() {
    return (
      <a className="rounded-button" onClick={this.props.clickFunction} href={this.props.href}>{this.props.buttonText}</a>
    );
  }
}

RoundedButton.displayName = 'RoundedButton';

RoundedButton.propTypes = {
  buttonText: React.PropTypes.string.isRequired,
  clickFunction: React.PropTypes.func,
  href: React.PropTypes.string
};

RoundedButton.defaultProps = {
  clickFunction: () => {},
  href: 'javascript:void(0)'
};
