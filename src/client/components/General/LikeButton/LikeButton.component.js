/**
 * @file
 * Creates a binary 'Like' button
 */
import React from 'react';
import './like-button.scss';
import Icon from '../Icon/Icon.component.js';
import heartSvg from '../Icon/svg/functions/heart.svg';
import heartFullSvg from '../Icon/svg/functions/heart-full.svg';

export default function LikeButton({usersWhoLikeThis=[], isLikedByCurrentUser = false, likeFunction = () => {}, unlikeFunction = () => {}, active=false}) {

  const text = (usersWhoLikeThis.length > 0) ? <p>{usersWhoLikeThis.length} kan godt lide dette</p> : <p>kan godt lide dette</p>;

  const glyph = (isLikedByCurrentUser) ? heartFullSvg : heartSvg;

  const clickFunction = (isLikedByCurrentUser) ? unlikeFunction : likeFunction;

  const classNames = (!active) ? 'like-button like-button--inactive' : 'like-button';

  return (
    <a className={classNames} onClick={clickFunction}>
      <Icon glyph={glyph} className={'like-button--heart-icon'}/>
      {text}
    </a>
  );
}

LikeButton.propTypes = {
  usersWhoLikeThis: React.PropTypes.any,
  isLikedByCurrentUser: React.PropTypes.bool,
  active: React.PropTypes.bool,
  likeFunction: React.PropTypes.func,
  unlikeFunction: React.PropTypes.func
};
