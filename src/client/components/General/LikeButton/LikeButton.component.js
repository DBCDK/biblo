'use strict';

import React from 'react';
import './like-button.scss';
import Icon from '../Icon/Icon.component.js';
import heartSvg from '../Icon/svg/functions/heart.svg';
import heartFullSvg from '../Icon/svg/functions/heart-full.svg';


/**
 * Creates a binary 'Like' button
 */

export default function LikeButton({usersWhoLikeThis=[1], isLikedByCurrentUser = false, likeFunction = () => {}, unlikeFunction = () => {}}) {

  const text = (usersWhoLikeThis.length > 0) ? <p>{usersWhoLikeThis.length} kan godt lide dette</p> : null;

  const glyph = (isLikedByCurrentUser) ? heartFullSvg : heartSvg;

  return (
    <a className='like-button' onClick={isLikedByCurrentUser && likeFunction || unlikeFunction}>
      <Icon glyph={glyph} className={'like-button--heart-icon'}/>
      {text}
    </a>
  );
}

