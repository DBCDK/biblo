'use strict';

import React from 'react';

export default class BackButton extends React.Component {
  render() {
    return (
      <a className="back-button" onClick={() => window.history.back()} href="javascript:void(0)">Tilbage</a>
    );
  }
}

BackButton.displayName = 'BackButton';
