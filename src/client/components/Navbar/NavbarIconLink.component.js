'use strict';

import React, {PropTypes} from 'react';

export default function NavBarIconLink(props) {
  return (
    <a className={`icon-link--${props.icon}`}
      href={props.url} onClick={(event) => props.onClick && props.onClick(event)} ><span
      className={`icon icon--${props.icon}`} ></span></a>
  );
}

NavBarIconLink.propTypes = {
  url: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
