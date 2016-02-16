'use strict';

import ClassNames from 'classnames';
import Icon from '../Icon/Icon.component.js';

import plusSvg from '../Icon/svg/functions/plus.svg';
import checkedSvg from '../Icon/svg/functions/checked.svg';


import './follow.scss';

/**
 * A button that toggles between active and in-active
 *
 * @param active
 * @param text
 * @param onClick
 * @returns {XML}
 * @constructor
 */
export default function Follow({active, text, onClick}) {
  const classes = {
    follow: true,
    'is-active': active
  };
  return (
    <a className={ClassNames(classes)} href='#follow' onClick={() => onClick && onClick(!active)}>
      <Icon glyph={active && checkedSvg || plusSvg} />{text}
    </a>
  );
}
