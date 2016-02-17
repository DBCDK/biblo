'use strict';

import './scss/post-view.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import Icon from '../../General/Icon/Icon.component.js';
import backSvg from '../../General/Icon/svg/functions/back.svg';

export default function PostView({content, image, timestamp, profile}) {
  return (
    <div className='post-wrapper' >
      <div className='post-profile-image' >
        <img src={profile.imageSrc} alt={profile.name} />
      </div>
      <div className='post' >
        <div className='post--header' >
          <span className='username' >{profile.name}</span> <span className='time' >{TimeToString(timestamp)}</span>
        </div>
        <p className='content' >{content}</p>
        {
          image &&
          <div className='media' ><img src={image} alt="image for post" /></div>
        }
        <a className='add-comment' href="#add-comment" ><Icon glyph={backSvg} />Svar</a>
      </div>
    </div>
  );
}

PostView.propTypes = {
  content: React.PropTypes.string,
  image: React.PropTypes.string,
  timestamp: React.PropTypes.string,
  profile: React.PropTypes.object
};
