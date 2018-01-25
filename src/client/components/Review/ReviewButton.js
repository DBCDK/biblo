/**
 *  @file handle actions and flow state related to reviews
 */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../General/Icon/Icon.component.js';
import Login from '../General/Login/Login.component.js';
import './ReviewButton.scss';

export class ReviewButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginPending: false
    };
  }

  handleClick() {
    if (this.props.profile.userIsLoggedIn || !this.props.loginRequired) {
      this.props.clickFunction();
    }
    else {
      this.setState({
        loginPending: true
      });
    }
  }

  render() {
    if (this.state.loginPending) {
      return (<Login>Log ind for at skrive en anmeldelse </Login>);
    }

    const editText = this.props.editText;
    const icon = this.props.glyph ? (<Icon glyph={this.props.glyph}/>) : (<span/>);

    return (
      <a className="review-button" onClick={this.handleClick.bind(this)}>
        <span>
          {icon}{editText}
        </span>
      </a>
    );
  }
}

ReviewButton.displayName = 'ReviewButton';
ReviewButton.propTypes = {
  editText: PropTypes.string,
  clickFunction: PropTypes.func,
  profile: PropTypes.object,
  glyph: PropTypes.object,
  loginRequired: PropTypes.bool
};

ReviewButton.defaultProps = {
  loginRequired: true
};
