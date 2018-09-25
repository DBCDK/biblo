import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import Icon from '../Icon/Icon.component.js';

import plusSvg from '../Icon/svg/functions/plus.svg';
import checkedSvg from '../Icon/svg/functions/checked.svg';
import Login from '../../General/Login/Login.component.js';

import './follow.scss';

/**
 * A button that toggles between active and in-active
 *
 * @param active
 * @param text
 * @param onClick
 * @param showLoginLink
 * @returns {XML}
 * @constructor
 */
export default function Follow({active, text, onClick, showLoginLink}) {
  const classes = {
    follow: true,
    'is-active': active
  };

  if (showLoginLink) {
    return <Login>Log ind for at følge gruppen</Login>;
  }

  return (
    <a className={ClassNames(classes)} href="#follow" onClick={() => onClick && onClick(!active)}>
      <Icon glyph={(active && checkedSvg) || plusSvg} />
      {text}
    </a>
  );
}

Follow.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  showLoginLink: PropTypes.bool
};
