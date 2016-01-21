'use strict';
/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import GroupCreateContainer from './GroupCreateContainer.component';

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <GroupCreateContainer />,
  document.getElementById('page')
);
