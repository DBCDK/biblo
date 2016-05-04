import React from 'react';
import Icon from '../General/Icon/Icon.component.js';
import Login from '../General/Login/Login.component.js';
import pencilSvg from '../General/Icon/svg/functions/pencil.svg';
import './ReviewButton.scss';

export class ReviewButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginPending: false
    };
  }

  handleClick () {
    if (this.props.profile.userIsLoggedIn) {
      this.props.clickFunction();
    }
    else {
      this.setState({
        loginPending: true
      });
    }
  }

  render() {
    let {
      editText
      }= this.props;

    if (this.state.loginPending) {
      return (<Login>Log ind for at skrive en anmeldelse </Login>);
    }
    return (
      <a className="review-button" onClick={this.handleClick.bind(this)}>
       <span>
          <Icon glyph={pencilSvg}/>{editText}
        </span>
      </a>
    );
  }

}

ReviewButton.displayName = 'ReviewButton';
ReviewButton.propTypes = {
  editText: React.PropTypes.string,
  clickFunction: React.PropTypes.func,
  profile: React.PropTypes.object
};

export default ReviewButton;
