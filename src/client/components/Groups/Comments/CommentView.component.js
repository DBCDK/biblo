'use strict';

import './scss/comment-view.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';

import flagSvg from '../../General/Icon/svg/functions/flag.svg';


export default function CommentView({content, commentId, image, timeCreated, owner, submitFlagFunction = () => {}, uiActions = {}}) {

  const commentFlagModalContent = (
    <CreateFlagDialog
      submitFunction={submitFlagFunction}
      onClose={uiActions.closeModalWindow}
      contentType={'comment'}
      contentId={commentId}
      />
  );

  return (
    <div className='comment-wrapper' >
      <div className='comment-profile-image' >
        <img className='profile-image' src={owner.image || null} alt={owner.displayName} />
      </div>
      <div className='comment' >
        <div className='comment--header' >
          <a href={`/profil/${owner.id}`}><span className='username' >{owner.displayName}</span></a> <span className='time' >{TimeToString(timeCreated)}</span>
          <span className='buttons'>
            <TinyButton
              clickFunction={() => {
                uiActions.openModalWindow(commentFlagModalContent);
              }}
              icon={<Icon glyph={flagSvg} />}
              />
          </span>
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
  commentId: React.PropTypes.number,
  image: React.PropTypes.string,
  submitFlagFunction: React.PropTypes.func.isRequired,
  timestamp: React.PropTypes.string,
  owner: React.PropTypes.object,
  uiActions: React.PropTypes.object.isRequired
};
