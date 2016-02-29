'use strict';

import Icon from '../Icon/Icon.component.js';

import plusSvg from '../Icon/svg/functions/plus.svg';

import './more-button.scss';

/**
 * An add-more-items button
 *
 * @param text
 * @param onClick
 * @returns {XML}
 * @constructor
 */
export default function MoreButton({text, onClick}) {
  return (
    <a className='more-button'>
      <Icon glyph={plusSvg} />{text}
    </a>
  );
}
