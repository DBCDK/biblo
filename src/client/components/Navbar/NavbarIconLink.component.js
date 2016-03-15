'use strict';

import React, {PropTypes} from 'react';


import Icon from '../General/Icon/Icon.component';


export default function NavBarIconLink(props) {
  return (
    <a
      className="navbar--link" href={props.url} onClick={(event) => props.onClick && props.onClick(event)}>
      <Icon className={props.className} width="100" height="30" glyph={props.glyph}/>
    </a>
  );
}

NavBarIconLink.propTypes = {
  url: PropTypes.string.isRequired,
  glyph: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
