'use strict';
/**
 * @file
 * entry point for the search page
 */
import React from 'react';
import ReactDOM from 'react-dom';
import ProfileDetailContainer from './ProfileDetailContainer.component';

/**
 * Client side rendering of the Frontpage Component
 */
ReactDOM.render(
  <ProfileDetailContainer />,
  document.getElementById('content')
);
