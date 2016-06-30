import ClassNames from 'classnames';
import React, {PropTypes} from 'react';
import './scss/navbar-toggle.scss';

/**
 * Toggle Burger Menu Button
 * @param props
 * @returns {XML}
 * @constructor
 */
export default function NavbarToggle(props) {
  const classes = {
    'navbar--toggle': true,
    'is-active': props.active || false
  };

  return (
    <a className={ClassNames(classes)} href="#" onClick={props.onToggle}>
      <span></span>
    </a>
  );
}

NavbarToggle.propTypes = {
  active: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
};
