import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../General/Icon/Icon.component';

export function NavBarIconLink(props) {
  return (
    <a
      className="navbar--link"
      href={props.url}
      onClick={(event) => props.onClick && props.onClick(event)}
    >
      <Icon
        className={props.className}
        width={35}
        height={35}
        glyph={props.glyph}
      />
    </a>
  );
}

NavBarIconLink.propTypes = {
  url: PropTypes.string.isRequired,
  glyph: PropTypes.any.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
