import React from 'react';
import Icon from '../General/Icon/Icon.component.js';
import pencilSvg from '../General/Icon/svg/functions/pencil.svg';
import './ReviewButton.scss';

const ReviewButton = ({editText, clickFunction}) => {
  return (
    <a className="review-button" onClick={clickFunction}>
       <span>
          <Icon glyph={pencilSvg}/>{editText}
        </span>
    </a>
  );
};

ReviewButton.displayName = 'ReviewButton';
ReviewButton.propTypes = {
  editText: React.PropTypes.string,
  clickFunction: React.PropTypes.func
};
export default ReviewButton;
