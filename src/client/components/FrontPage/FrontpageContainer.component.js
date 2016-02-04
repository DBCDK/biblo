'use strict';

import React from 'react';
import './_frontpage.scss';

export default class FrontpageContainer extends React.Component {
  render() {
    return (
      <div className="frontpage--container">
        <h1>Biblo</h1>
        <p>Content area...</p>
        <a href="/login" >Login</a>
      </div>
    );
  }
}

FrontpageContainer.displayName = 'FrontpageContainer';
