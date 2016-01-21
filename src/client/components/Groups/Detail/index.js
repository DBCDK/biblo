'use strict';
/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import GroupDetailContainer from './GroupDetailContainer.component';

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <GroupDetailContainer />,
  document.getElementById('page')
);
