'use strict';

import React from 'react';
import './_footer.scss';

export default class FooterContainer extends React.Component {
  render() {
    return (
      <div className="footer--container">
        <span className="footer--text">footer</span>
      </div>
    );
  }
}

FooterContainer.displayName = 'FooterContainer';
