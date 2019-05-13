import React from 'react';

import CookieWarningContainer from '../CookieWarning/CookieWarningContainer.component';
import ModeratorMessageModal from '../ModeratorMessageModal/ModeratorMessageModal.component';
import {checkForModeratorMessages} from '../../Actions/profile.actions'; // './Actions/profile.actions';

import NavBar from '../Navbar/NavbarContainer.component.js';
import Footer from '../Footer/FooterContainer.component.js';
import Konami from '../General/Konami/Konami.component';
import PropTypes from 'prop-types';

if (typeof window !== 'undefined' && window.FastClick) {
  window.addEventListener('load', () => {
    window.FastClick.attach(document.body);
  });
}

import './page-layout.scss';

export default class PageLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const userIsLoggedIn = this.props.profileState.userIsLoggedIn;
    if (userIsLoggedIn) {
      checkForModeratorMessages();
      this.interval = setInterval(() => {
        checkForModeratorMessages();
      }, 300000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="container">
        <NavBar {...this.props} />
        <div className="content">{this.props.children}</div>
        <CookieWarningContainer />
        <ModeratorMessageModal profileState={this.props.profileState} profileActions={this.props.profileActions} />
        <Footer globalState={this.props.globalState} />
        <Konami />
      </div>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.any.isRequired,
  profileState: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  globalState: PropTypes.object.isRequired,
  searchActions: PropTypes.object.isRequired,
  profileActions: PropTypes.object.isRequired
};
