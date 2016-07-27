import React, {PropTypes} from 'react';

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
        width={props.width}
        height={props.height}
        glyph={props.glyph}
      />
    </a>
  );
}

NavBarIconLink.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  url: PropTypes.string.isRequired,
  glyph: PropTypes.any.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
