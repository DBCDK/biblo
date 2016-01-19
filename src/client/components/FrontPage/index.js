'use strict';
/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import FrontpageContainer from './FrontpageContainer.component';

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <FrontpageContainer />,
  document.getElementById('frontpage-container')
);
