'use strict';

import Icon from '../Icon/Icon.component.js';

import plusSvg from '../Icon/svg/functions/plus.svg';
import spinnerSvg from '../Icon/svg/spinners/loading-spin.svg';

import './more-button.scss';

/**
 * An add-more-items button
 *
 * @param text
 * @param onClick
 * @returns {XML}
 * @constructor
 */
export default function MoreButton({text, onClick, isLoading}) { // eslint-disable-line no-unused-vars
  const icon = (isLoading) ? <Icon glyph={spinnerSvg} /> : <Icon glyph={plusSvg} />;
  return (
    <a className='more-button' onClick={onClick}>
      {icon} {text}
    </a>
  );
}
