'use strict';

import React from 'react';
import './tiny-button.scss'

const TinyButton = ({clickFunction, icon}) => {
  return (
    <span className='tiny-button'>
      <a onClick={clickFunction}>{icon}</a>
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
