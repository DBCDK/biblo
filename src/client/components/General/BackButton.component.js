'use strict';

import React from 'react';

export default class BackButton extends React.Component {
  render() {
    let backFunction = (e) => {
      e.preventDefault();
      window.history.back();
    };

    return (
      <a className="back-button" onClick={backFunction} href="/">Tilbage</a>
    );
  }
}

BackButton.displayName = 'BackButton';
