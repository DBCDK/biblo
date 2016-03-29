'use strict';

import React, {PropTypes} from 'react';

/**
 * Creates a single link for the navigation bar
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
export default function NavbarLink(props) {
  return (
    <a className='navbar--link' href={props.url}
       onClick={(event) => props.onClose && props.onClose(event)}>{props.value}</a>
  );
}

NavbarLink.propTypes = {
  url: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
