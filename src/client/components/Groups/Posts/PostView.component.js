'use strict';

import './scss/PostView.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import ContentAdd from '../AddContent/AddContent.component';
import CommentList from '../Comments/CommentList.component';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';
import LikeButton from '../../General/LikeButton/LikeButton.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';

import backSvg from '../../General/Icon/svg/functions/back.svg';
import flagSvg from '../../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

import {includes} from 'lodash';

export default
class PostView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCommentInputVisible: false,
      isEditting: false
    };

    this.submitPostFlag = this.submitPostFlag.bind(this);
    this.likePost = this.likePost.bind(this);
    this.unlikePost = this.unlikePost.bind(this);
    this.submitCommentFlag = this.submitCommentFlag.bind(this);
  }

  toggleCommentInput(event) {
    event.preventDefault();
    this.setState({isCommentInputVisible: !this.state.isCommentInputVisible});
  }

  submitPostFlag(flag) { // eslint-disable-line
    flag.flagger = this.props.profile.id;
    this.props.flagActions.flagPost(flag);
  }

  submitCommentFlag(flag) { // eslint-disable-line
    flag.flagger = this.props.profile.id;
    this.props.flagActions.flagComment(flag);
  }

  submitGroupFlag(flag) { // eslint-disable-line
    flag.flagger = this.props.profile.id;
    this.props.flagActions.flagGroup(flag);
  }

  likePost() {
    this.props.likeActions.likePost({
      postId: this.props.id,
      profileId: this.props.profile.id
    });
  }

  unlikePost() {
    this.props.likeActions.unlikePost({
      postId: this.props.id,
      profileId: this.props.profile.id
    });
  }

  toggleEditting() {
    this.setState({isEditting: !this.state.isEditting});
  }


  render() {
    const {
      groupActions,
      content,
      image,
      timeCreated,
      owner,
      id,
      profile,
      groupId,
      comments,
      uiActions,
      commentsCount,
      numberOfCommentsLoaded,
      loadingComments
      } = this.props;

    const postFlagModalContent = (
      <CreateFlagDialog
        submitFunction={this.submitPostFlag}
        onClose={uiActions.closeModalWindow}
        contentType={'post'}
        contentId={id}
      />
    );

    const isLikedByCurrentUser = includes(this.props.likes, this.props.profile.id);

    const likeButton = (
      <LikeButton
        likeFunction={this.likePost}
        unlikeFunction={this.unlikePost}
        usersWhoLikeThis={this.props.likes}
        isLikedByCurrentUser={isLikedByCurrentUser}
        />
    );

    return (
      <div className='post-wrapper'>
        <div className='post-profile-image'>
          <img src={owner.image || null} alt={owner.displayName}/>
        </div>
        <div className='post'>
          <div className='post--header'>
            <a href={`/profil/${owner.id}`}><span className='username'>{owner.displayName}</span></a>
            <span className='time'>{this.state.isEditting && 'Retter nu' || TimeToString(timeCreated)}</span>
            <span className='buttons'>
              {profile.id === owner.id &&
              <TinyButton active={this.state.isEditting} clickFunction={() => this.toggleEditting()} icon={<Icon glyph={pencilSvg}/>}/>
                ||
              <TinyButton
                clickFunction={() => {
                  this.props.uiActions.openModalWindow(postFlagModalContent);
                }}
                icon={<Icon glyph={flagSvg} />}
                />
              }
            </span>
          </div>
          {
            this.state.isEditting &&
            <ContentAdd redirectTo={`/grupper/${groupId}`} profile={profile} parentId={groupId} type="post"
                        abort={() => this.toggleEditting()} text={content} image={image} id={id}/>
            ||
            <div className='post--content'>
              <p className='content'>{content}</p>
              {
                image &&
                <div className='media'><img src={image} alt="image for post"/></div>
              }
            </div>
          }
          <CommentList comments={comments} profile={profile} groupId={groupId} postId={id} submitFlagFunction={this.submitCommentFlag} uiActions={this.props.uiActions} />
          <div className="post--load-more-comments">
            {commentsCount > numberOfCommentsLoaded &&
            (<div>
              <ExpandButton isLoading={loadingComments}
                            onClick={() => groupActions.asyncShowMoreComments(id, numberOfCommentsLoaded, 10)}
                            text="Vis flere"/>
              <span className="post--comment-count">
                {commentsCount} {commentsCount === 1 && 'kommentar' || 'kommentarer'}
              </span>
            </div>)
            }
          </div>
          {this.state.isCommentInputVisible &&
          <div className="comment-add-wrapper">
            <ContentAdd redirectTo={this.props.commentRedirect || `/grupper/${groupId}`} profile={profile} parentId={id}
                        type="comment"
                        abort={e => this.toggleCommentInput(e)}/>
          </div>
          ||
          <a className="comment-add-button" href="#add-comment"
             onClick={e => this.toggleCommentInput(e)}><Icon glyph={backSvg}/>Svar</a>
          }
          {likeButton}
        </div>
      </div>
    );
  }
}

PostView.propTypes = {
  groupActions: React.PropTypes.object,
  content: React.PropTypes.string,
  image: React.PropTypes.string,
  timeCreated: React.PropTypes.string,
  owner: React.PropTypes.object,
  likes: React.PropTypes.array,
  id: React.PropTypes.number,
  profile: React.PropTypes.object.isRequired,
  groupId: React.PropTypes.number,
  comments: React.PropTypes.array,
  uiActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  commentsCount: React.PropTypes.number,
  numberOfCommentsLoaded: React.PropTypes.number,
  loadingComments: React.PropTypes.bool,
  commentRedirect: React.PropTypes.string
};
