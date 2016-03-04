'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as uiActions from '../../Actions/ui.actions.js';

import NavBar from '../Navbar/NavbarContainer.component.js';
import Footer from '../Footer/FooterContainer.component.js';
import ModalWindow from '../General/ModalWindow/ModalWindow.component.js';
import {PropTypes} from 'react';

import FastClick from 'fastclick';

window.addEventListener('load', () => {
  FastClick.attach(document.body);
});

import './page-layout.scss';

export default class PageLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const modal = (this.props.ui.modal.isOpen) ? <ModalWindow onClose={() => {this.props.uiActions.closeModalWindow()}}>{this.props.ui.modal.children}</ModalWindow> : null; // eslint-disable-line
    return (
      <div className="container">
        {modal}
        <NavBar />
        <div className="content">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.any.isRequired,
  ui: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      ui: state.uiReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => { // eslint-disable-line no-unused-vars
    return {
      uiActions: bindActionCreators(uiActions, dispatch)
    };
  }
)(PageLayout);
