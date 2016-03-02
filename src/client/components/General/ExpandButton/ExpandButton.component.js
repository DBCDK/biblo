'use strict';

import Icon from '../Icon/Icon.component.js';

import plusSvg from '../Icon/svg/functions/plus.svg';
import spinnerSvg from '../Icon/svg/spinners/loading-spin.svg';

import './expand-button.scss';

/**
 * An expand button
 *
 * @param text
 * @param onClick
 * @returns {XML}
 * @constructor
 */
export default function ExpandButton({text, onClick, isLoading}) { // eslint-disable-line no-unused-vars
  const icon = (isLoading) ? <Icon glyph={spinnerSvg} /> : <Icon glyph={plusSvg} />;
  return (
    <a className='expand-button' onClick={onClick}>
      {icon} {text}
    </a>
  );
}
