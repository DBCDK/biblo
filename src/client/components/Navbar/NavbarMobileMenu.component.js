import React, {PropTypes} from 'react';
import ClassNames from 'classnames';

import './scss/navbar-mobile-menu.scss';

/**
 * FallDown menu for mobile units
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
export default function NavBarMobileMenu(props) {
  const classes = {
    'navbar-mobile-menu': true,
    'is-active': props.active
  };
  classes[props.type] = true;

  return (
    <div className={ClassNames(classes)}>
      <div className="inner">
        {props.children}
      </div>
    </div>
  );
}

NavBarMobileMenu.propTypes = {
  active: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
};
