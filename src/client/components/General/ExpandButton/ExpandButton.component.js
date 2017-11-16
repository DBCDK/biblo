import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon.component.js';
import plusSvg from '../Icon/svg/functions/plus.svg';
import spinnerSvg from '../Icon/svg/spinners/loading-spin.svg';

import './expand-button.scss';

/**
 * An expand button
 *
 * @param text
 * @param onClick
 * @param isLoading
 * @param iconOverride
 * @returns {XML}
 * @constructor
 */
export default function ExpandButton({text, onClick, isLoading, iconOverride}) { // eslint-disable-line no-unused-vars
  let icon = isLoading ? <Icon glyph={spinnerSvg} /> : <Icon glyph={plusSvg} />;

  return (
    <a className='expand-button' onClick={onClick}>
      {iconOverride || icon}{text}
    </a>
  );
}

ExpandButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  iconOverride: PropTypes.element
};
