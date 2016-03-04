'use strict';

import React from 'react';
import './tiny-button.scss';

const TinyButton = ({icon, clickFunction}) => {
  return (
    <span className='tiny-button' onClick={clickFunction}>
      <a>{icon}</a>
    </span>
  );
};

TinyButton.displayName = 'TinyButton.component';

TinyButton.propTypes = {
  clickFunction: React.PropTypes.func,
  icon: React.PropTypes.element.isRequired
};

TinyButton.defaultProps = {
  clickFunction: () => {}
};

export default TinyButton;
