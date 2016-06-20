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
    <a className={`navbar--link ${props.className}`} href={props.url}
       onClick={(event) => props.onClick && props.onClick(event)}>{props.value}</a>
  );
}

NavbarLink.propTypes = {
  url: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

NavbarLink.defaultProps = {
  className: ''
};
