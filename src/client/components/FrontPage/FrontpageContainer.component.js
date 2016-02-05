'use strict';

import React from 'react';
import './_frontpage.scss';

export default class FrontpageContainer extends React.Component {
  render() {
    const loginLink = !window || !window.USER_IS_LOGGED_IN ? <a href="/login" >Log ind</a> : <a href="/logout" >Log ud</a>;

    return (
      <div className="frontpage--container">
        <h1>Biblo</h1>
        <p>Content area...</p>
        {loginLink}
      </div>
    );
  }
}

FrontpageContainer.displayName = 'FrontpageContainer';
