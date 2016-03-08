'use strict';

import React from 'react';

import NavBar from '../Navbar/NavbarContainer.component.js';
import Footer from '../Footer/FooterContainer.component.js';
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
    return (
      <div className="container">
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
};
