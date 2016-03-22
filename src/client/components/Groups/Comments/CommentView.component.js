'use strict';

import './scss/comment-view.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';
import ContentAdd from '../AddContent/AddContent.component.js';

import flagSvg from '../../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

export default
class CommentView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEditting: false
    };
  }

  toggleEditting() {
    this.setState({isEditting: !this.state.isEditting});
  }

  render() {
    const {id, content, html, image, timeCreated, owner, profile, groupId, postId, submitFlagFunction, uiActions, groupActions} = this.props;
    const commentFlagModalContent = (
      <CreateFlagDialog
        submitFunction={submitFlagFunction}
        onClose={uiActions.closeModalWindow}
        contentType={'comment'}
        contentId={id}
      />
    );
    return (
      <div className='comment-wrapper'>
        <div className='comment-profile-image'>
          <img className='profile-image' src={owner.image || null} alt={owner.displayName}/>
        </div>
        <div className='comment'>
          <div className='comment--header'>
            <a href={`/profil/${owner.id}`}>
              <span className='username'>{owner.displayName}</span>
            </a> <span className='time'>{this.state.isEditting && 'Retter nu' || TimeToString(timeCreated)}</span>
          </div>

          <div className='comment--actions'>
            {(profile.id === owner.id || profile.isModerator) &&
            <TinyButton active={this.state.isEditting} clickFunction={() => this.toggleEditting()}
                        icon={<Icon glyph={pencilSvg} className="icon edit-comment--button"/>}/>
            ||
            <TinyButton
              clickFunction={() => {
                uiActions.openModalWindow(commentFlagModalContent);
              }}
              icon={<Icon glyph={flagSvg}  className="icon flag-comment--button"/>}
            />
            }
          </div>
          {
            this.state.isEditting &&
            <ContentAdd redirectTo={`/grupper/${groupId}`} profile={profile} parentId={postId} type="comment"
                        abort={() => this.toggleEditting()} text={content} image={image} id={id} autofocus={true}
                        addContentAction={groupActions.editComment}/>
            ||
            <div className="comment--content">
              {
                <p className='content' dangerouslySetInnerHTML={{__html: html}} /> // eslint-disable-line
              }
              {
                image &&
                <div className='media'><img src={image} alt="image for post"/></div>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

CommentView.propTypes = {
  id: React.PropTypes.number,
  postId: React.PropTypes.number,
  groupId: React.PropTypes.number,
  content: React.PropTypes.string,
  html: React.PropTypes.string,
  image: React.PropTypes.string,
  timeCreated: React.PropTypes.string,
  profile: React.PropTypes.object,
  owner: React.PropTypes.object,
  submitFlagFunction: React.PropTypes.func.isRequired,
  timestamp: React.PropTypes.string,
  groupActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired
};
