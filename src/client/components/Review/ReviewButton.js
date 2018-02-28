/**
 *  @file handle actions and flow state related to reviews
 */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../General/Icon/Icon.component.js';
import Login from '../General/Login/Login.component.js';
import ProfileLibraryInfoModalContainer from '../Profile/Edit/ProfileLibraryInfoModalContainer.component';
import './ReviewButton.scss';

export class ReviewButton extends React.Component {
  static propTypes = {
    editText: PropTypes.string,
    clickFunction: PropTypes.func,
    profile: PropTypes.object,
    glyph: PropTypes.object,
    loginRequired: PropTypes.bool
  };

  static defaultProps = {
    loginRequired: true
  };

  state = {
    loginPending: false,
    displayLibrarySelectModal: false
  };

  handleClick() {
    if (this.props.profile.userIsLoggedIn || !this.props.loginRequired) {
      if (!this.props.profile.favoriteLibrary.hasOwnProperty('libraryId') && this.props.loginRequired) {
        this.setState({displayLibrarySelectModal: true});
      }
      else {
        this.props.clickFunction();
      }
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
    const icon = this.props.glyph ? (<Icon glyph={this.props.glyph} />) : (<span />);

    const modal = this.state.displayLibrarySelectModal ? <ProfileLibraryInfoModalContainer
      onModalCloseClicked={() => this.setState({displayLibrarySelectModal: false})}
      title={'Du skal udfylde din lånerinformation for at kunne anmelde materialer'}
      onProfileSaved={() => {
        this.setState({displayLibrarySelectModal: false});
        this.props.clickFunction();
      }}
    /> : null;

    return (
      <React.Fragment>
        <a className="review-button" onClick={this.handleClick.bind(this)}>
          <span>
            {icon}{editText}
          </span>
        </a>
        {modal}
      </React.Fragment>
    );
  }
}
