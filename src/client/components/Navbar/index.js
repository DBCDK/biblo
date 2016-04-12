/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import NavbarContainer from './NavbarContainer.component.js';

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <NavbarContainer />,
  document.getElementById('navbar')
);
