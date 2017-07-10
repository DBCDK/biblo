import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './tiny-button.scss';

const TinyButton = ({icon, clickFunction, active}) => {
  const classes = {
    'tiny-button': true,
    active: active
  };

  return (
    <span className={classnames(classes)} onClick={clickFunction}>
      <a>{icon}</a>
      <div className="tiny-button--click-overlay"> </div>
    </span>
  );
};

TinyButton.displayName = 'TinyButton.component';

TinyButton.propTypes = {
  clickFunction: PropTypes.func,
  icon: PropTypes.element.isRequired,
  active: PropTypes.bool
};

TinyButton.defaultProps = {
  clickFunction: () => {}
};

export default TinyButton;
