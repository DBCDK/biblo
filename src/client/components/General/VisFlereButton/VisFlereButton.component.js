import React from 'react';
import './VisFlereButton.component.scss';
import Icon from '../Icon/Icon.component';
import plusSvg from '../Icon/svg/functions/plus.svg';

export default function VisFlereButton({onClick}) {
  return (
    <div className="show-more-button--container">
      <span className="show-more-button" onClick={onClick}>
        <Icon glyph={plusSvg} className="icon follow-plus" /> VIS FLERE
      </span>
    </div>
  );
}

VisFlereButton.displayName = 'VisFlereButton';
VisFlereButton.propTypes = {
  onClick: React.PropTypes.func
};
