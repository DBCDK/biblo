'use strict';
/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import GroupViewContainer from './GroupViewContainer.component.js';

const data = window.DATA && JSON.parse(window.DATA) || {};

// @todo this is a dummy profile, should be exchanged with a real profile
const profile = {
  role: window.USER_IS_LOGGED_IN && 1 || 0,
  id: 1,
  name: 'Dummy Dum Dum'
};

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <GroupViewContainer {...data} profile={profile} />,
  document.getElementById('content')
);
