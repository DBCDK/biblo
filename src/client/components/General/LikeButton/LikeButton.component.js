/**
 * @file
 * Creates a binary 'Like' button
 */
import React from 'react';
import PropTypes from 'prop-types';
import './like-button.scss';
import Icon from '../Icon/Icon.component.js';
import heartSvg from '../Icon/svg/functions/heart.svg';
import heartFullSvg from '../Icon/svg/functions/heart-full.svg';

export default function LikeButton({
  usersWhoLikeThis = [],
  isLikedByCurrentUser = false,
  likeFunction = () => {},
  unlikeFunction = () => {},
  active = false,
  small = false
}) {
  let text;
  if (small) {
    text = usersWhoLikeThis.length > 0 ? <p>{usersWhoLikeThis.length}</p> : <p />;
  } else {
    text =
      usersWhoLikeThis.length > 0 ? <p>{usersWhoLikeThis.length} kan godt lide dette</p> : <p>kan godt lide dette</p>;
  }

  const glyph = isLikedByCurrentUser ? heartFullSvg : heartSvg;

  const clickFunction = isLikedByCurrentUser ? unlikeFunction : likeFunction;

  const classNames = !active ? 'like-button like-button--inactive' : 'like-button';

  return (
    <a className={classNames} onClick={clickFunction}>
      <Icon glyph={glyph} className={'like-button--heart-icon'} />
      {text}
    </a>
  );
}

LikeButton.propTypes = {
  usersWhoLikeThis: PropTypes.any,
  isLikedByCurrentUser: PropTypes.bool,
  active: PropTypes.bool,
  likeFunction: PropTypes.func,
  unlikeFunction: PropTypes.func,
  small: PropTypes.bool
};
