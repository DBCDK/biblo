import React from 'react';
import PropTypes from 'prop-types';
import TimeToString from '../../../Utils/timeToString';

import Icon from '../../General/Icon/Icon.component.js';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import heartSvg from '../../General/Icon/svg/functions/heart.svg';
import backSvg from '../../General/Icon/svg/functions/back.svg';

import './scss/ActivityRow.component.scss';

export default function ActivityRow({children, date, answerFunction, likes, title}) {
  let like, answerButton, activityTitle, childHtml;
  like = answerButton = activityTitle = childHtml = '';

  if (answerFunction) {
    answerButton = (
      <RoundedButton
        clickFunction={answerFunction}
        buttonText={
          <span className="rounded-button--back--svg">
            <Icon glyph={backSvg} /> Svar
          </span>
        }
        compact={true}
      />
    );
  }

  if (likes && likes > 0) {
    like = (
      <span className="activity-row--like-answer--likes">
        <Icon glyph={heartSvg} /> {likes} kan godt lide dette
      </span>
    );
  }

  if (title) {
    activityTitle = <h4>{title}</h4>;
  }

  if (children) {
    childHtml = <div className={'activity-row--children--no-image'}>{children}</div>;
  }

  let likeAnswer = (
    <div className="activity-row--like-answer">
      {answerButton} {like}
    </div>
  );

  return (
    <div className="activity-row--container">
      <div className="activity-row">
        <div className="activity-row--title">
          {activityTitle}
          <div className="activity-row--date">{date ? TimeToString(date) : ''}</div>
        </div>

        {childHtml}
        {likeAnswer}
      </div>
      <hr />
    </div>
  );
}

ActivityRow.propTypes = {
  children: PropTypes.any,
  date: PropTypes.string,
  answerFunction: PropTypes.func,
  likes: PropTypes.array,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
