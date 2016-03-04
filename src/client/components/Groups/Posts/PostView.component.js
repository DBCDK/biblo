'use strict';

import './scss/post-view.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import CommentAdd from '../AddContent/AddContent.component';
import CommentList from '../Comments/CommentList.component';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import backSvg from '../../General/Icon/svg/functions/back.svg';
import flagSvg from '../../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

export default class PostView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCommentInputVisible: false
    };
  }

  toggleCommentInput(event) {
    event.preventDefault();
    this.setState({isCommentInputVisible: !this.state.isCommentInputVisible});
  }

  submitFlag(flag) { // eslint-disable-line
  }

  render() {
    const {content, image, timeCreated, owner, id, profile, groupId, comments} = this.props;

    const flagModalContent = (
      <CreateFlagDialog
        submitFunction={this.submitFlag}
        onClose={this.props.uiActions.closeModalWindow}
        contentType={'post'}
        contentId={id}
      />
    );

    return (
      <div className='post-wrapper'>
        <div className='post-profile-image'>
          <img src={owner.image || null} alt={owner.displayName}/>
        </div>
        <div className='post'>
          <div className='post--header'>
            <span className='username'>{owner.displayName}</span>
            <span className='time'>{TimeToString(timeCreated)}</span>
            <span className='buttons'>
              <TinyButton
                clickFunction={() => {
                  this.props.uiActions.openModalWindow(flagModalContent);
                }}
                icon={<Icon glyph={flagSvg} />}
                />
              <TinyButton
                clickFunction={() => {}}
                icon={<Icon glyph={pencilSvg}/>}
                />
            </span>
          </div>
          <div className='post--content'>
            <p className='content'>{content}</p>
            {
              image &&
              <div className='media'><img src={image} alt="image for post"/></div>
            }
          </div>
          <CommentList comments={comments} profile={profile} groupId={groupId}/>
          {this.state.isCommentInputVisible &&
          <div className="comment-add-wrapper">
            <CommentAdd redirectTo={`/grupper/${groupId}`} profile={profile} parentId={id} type="comment"
                        abort={e => this.toggleCommentInput(e)}/>
          </div>
          ||
          <a className="comment-add-button" href="#add-comment"
             onClick={e => this.toggleCommentInput(e)}><Icon glyph={backSvg}/>Svar</a>
          }
        </div>
      </div>
    );
  }
}

PostView.propTypes = {
  content: React.PropTypes.string,
  image: React.PropTypes.string,
  timeCreated: React.PropTypes.string,
  owner: React.PropTypes.object,
  id: React.PropTypes.number,
  profile: React.PropTypes.object,
  groupId: React.PropTypes.number,
  comments: React.PropTypes.array,
  uiActions: React.PropTypes.object.isRequired
};
