import './click-overlay.scss';
import ClassNames from 'classnames';
import React, {PropTypes} from 'react';

/**
 * Adds a transparent overlay that can be used to catch clickevent outside an overlay box
 * e.g. a modal window or dropdown menu
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
export default function ClickOverlay({active, onClick}) {
  const classes = {
    'click-overlay': true,
    'is-active': active
  };

  return (
    <div className={ClassNames(classes)} onClick={onClick} ></div>
  );
}

ClickOverlay.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
