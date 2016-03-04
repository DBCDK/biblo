'use strict';

import './scss/comment-view.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';

export default function CommentView({content, image, timeCreated, owner}) {
  return (
    <div className='comment-wrapper' >
      <div className='comment-profile-image' >
        <img className='profile-image' src={owner.image || null} alt={owner.displayName} />
      </div>
      <div className='comment' >
        <div className='comment--header' >
          <a href={`/profil/${owner.id}`}><span className='username' >{owner.displayName}</span></a> <span className='time' >{TimeToString(timeCreated)}</span>
        </div>
        <p className='content' >{content}</p>
        {
          image &&
          <div className='media' ><img src={image} alt="image for post" /></div>
        }
      </div>
    </div>
  );
}

CommentView.propTypes = {
  content: React.PropTypes.string,
  image: React.PropTypes.string,
  timestamp: React.PropTypes.string,
  owner: React.PropTypes.object
};
