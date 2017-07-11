import React from 'react';
import PropTypes from 'prop-types';
import './VisFlereButton.component.scss';
import Icon from '../Icon/Icon.component';
import plusSvg from '../Icon/svg/functions/plus.svg';
import spinnerSvg from '../Icon/svg/spinners/loading-spin.svg';

export default function VisFlereButton({onClick, isLoading}) {

  let iconSvg = plusSvg;

  if (isLoading) {
    iconSvg = spinnerSvg;
  }

  return (
    <div className="show-more-button--container">
      <span className="show-more-button" onClick={onClick}>
        <Icon glyph={iconSvg} className="icon follow-plus" /> VIS FLERE
      </span>
    </div>
  );
}

VisFlereButton.displayName = 'VisFlereButton';
VisFlereButton.propTypes = {
  onClick: PropTypes.func,
  isLoading: PropTypes.bool
};
