'use strict';

import React from 'react';
import './_backbutton.component.scss';

const BackButton = () => {
  let backFunction = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <a className="back-button" onClick={backFunction} href="/">
      <div className="back-button--arrow-container">
        <span className="back-button--arrow"> </span>
        <span className="back-button--alt-text">Tilbage</span>
      </div>
    </a>
  );
};

BackButton.displayName = 'BackButton';
export default BackButton;
