'use strict';
/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import GroupEditContainer from './GroupEditContainer.component';

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <GroupEditContainer />,
  document.getElementById('page')
);
