'use strict';
/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import GroupsContainer from './GroupsContainer.component';

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <GroupsContainer />,
  document.getElementById('page')
);
