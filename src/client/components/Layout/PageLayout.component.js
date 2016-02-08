'use strict';

import NavBar from '../Navbar/NavbarContainer.component.js';
import Footer from '../Footer/FooterContainer.component.js';
import {PropTypes} from 'react';

import FastClick from 'fastclick';

window.addEventListener('load', () => {
  FastClick.attach(document.body);
});

import './page-layout.scss';

export default function PageLayout(props) {
  return (
    <div className="container">
      <NavBar />
      <div className="content">
        {props.children}
      </div>
      <Footer />
    </div>
  );
}

PageLayout.propTypes = {
  children: PropTypes.any.isRequired
};
