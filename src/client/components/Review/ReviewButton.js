import React from 'react';
import Icon from '../General/Icon/Icon.component.js';
import pencilSvg from '../General/Icon/svg/functions/pencil.svg';
import './ReviewButton.scss';

const ReviewButton = ({clickFunction}) => {
  return (
    <a className="review-button" onClick={clickFunction}>
       <span>
          <Icon glyph={pencilSvg}/>Skriv anmeldelse
        </span>
    </a>
  );
};

ReviewButton.displayName = 'ReviewButton';
export default ReviewButton;
