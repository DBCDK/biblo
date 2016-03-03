'use strict';

import React from 'react';
import TimeToString from '../../../Utils/timeToString';

import Icon from '../../General/Icon/Icon.component.js';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import heartSvg from '../../General/Icon/svg/functions/heart.svg';
import backSvg from '../../General/Icon/svg/functions/back.svg';

import './ActivityRow.component.scss';

export default function ActivityRow({children, imageSrc, date, answerFunction, likes}) {
  let image = '';

  if (imageSrc) {
    image = <img src={imageSrc} />;
  }

  let like = '';
  let answerButton = '';

  if (answerFunction) {
    answerButton = (
      <RoundedButton
        clickFunction={answerFunction}
        buttonText={<span className="rounded-button--back--svg"><Icon glyph={backSvg} /> Svar</span>}
        compact={true}
      />
    );
  }

  if (likes && likes > 0) {
    like = (
      <span className="activity-row--like-answer--likes"><Icon glyph={heartSvg} /> {likes} kan godt lide dette</span>
    );
  }

  let likeAnswer = (
    <div className="activity-row--like-answer">
      {answerButton} {like}
    </div>
  );

  return (
    <div className="activity-row--container">
      <div className="activity-row">
        <div className={'activity-row--image'}>
          {image}
        </div>

        <div className={'activity-row--children' + (imageSrc ? '' : ' no-image')}>
          <div className='activity-row--date'>
            {date ? TimeToString(date) : ''}
          </div>

          {children}
        </div>

        {likeAnswer}
      </div>
      <hr />
    </div>
  );
}
