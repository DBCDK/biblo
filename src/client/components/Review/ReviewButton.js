/**
 *  @file handle actions and flow state related to reviews
 */
import React from 'react';
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

  loginRequired () {
    return this.props.loginRequired;
  }

  handleClick () {
    if (this.props.profile.userIsLoggedIn || !this.props.loginRequired) {
      this.props.clickFunction();
    }
    else {
      this.setState({
        loginPending: true
      });
    }
  }

  getIcon () {
    let icon;
    if (this.props.glyph) {
      icon = (<Icon glyph={this.props.glyph}/>);
    }
    else {
      icon = (<span/>);
    }
    return icon;
  }

  render() {
    let {
      editText
      }= this.props;

    if (this.state.loginPending) {
      return (<Login>Log ind for at skrive en anmeldelse </Login>);
    }

    let icon = this.getIcon();
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
  editText: React.PropTypes.string,
  clickFunction: React.PropTypes.func,
  profile: React.PropTypes.object,
  glyph: React.PropTypes.string,
  loginRequired: React.PropTypes.bool
};

ReviewButton.defaultProps = {
  loginRequired: true
};

export default ReviewButton;
