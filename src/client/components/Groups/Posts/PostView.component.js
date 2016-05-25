/* eslint-disable react/no-danger */

import './scss/PostView.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import ExtractYoutubeID from '../../../Utils/extractYoutubeID';
import ContentAdd from '../AddContent/AddContent.component';
import CommentList from '../Comments/CommentList.component';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';
import LikeButton from '../../General/LikeButton/LikeButton.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import ConfirmDialog from '../../General/ConfirmDialog/ConfirmDialog.component.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';
import {getVideoPlayer} from '../General/GroupDisplayUtils';
import FeaturePreview from '../../General/FeaturePreview/FeaturePreview.component';

import Youtube from 'react-youtube';

import backSvg from '../../General/Icon/svg/functions/back.svg';
import flagSvg from '../../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

import {includes} from 'lodash';

export default class PostView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCommentInputVisible: false,
      isEditting: false
    };

    this.submitPostFlag = this.submitPostFlag.bind(this);
    this.likePost = this.likePost.bind(this);
    this.unlikePost = this.unlikePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.submitCommentFlag = this.submitCommentFlag.bind(this);
  }

  componentDidMount() {
    if (this.props.review && this.props.review.pid) {
      this.props.getCoverImage(this.props.review.pid, this.props.review.worktype);
      this.props.groupActions.asyncLoadMetadataForReview(this.props.review.pid);
    }
  }

  toggleCommentInput(event) {
    if (event) {
      event.preventDefault();
    }
    // if edit comment is initialed then close the post editor
    let isEditing = this.state.isEditting;
    if (!this.state.isCommentInputVisible) {
      isEditing = false;
    }
    this.setState({isCommentInputVisible: !this.state.isCommentInputVisible, isEditting: isEditing});
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

  deletePost() {

    const content = (
      <div>
        <p>Du er ved at slette et indlæg, du selv har skrevet. Hvis andre brugere har svaret på dit indlæg, vil det også blive slettet.</p>
        <p>Er du sikker på, at du vil slette indlægget og alle svar?</p>
      </div>
    );

    const dialog = (
      <ConfirmDialog
        cancelButtonText={'Fortryd'}
        confirmButtonText={'Slet Indlæg'}
        cancelFunc={() => {
          this.props.uiActions.closeModalWindow();
        }}
        confirmFunc={() => {
          this.props.groupActions.asyncDeletePost(this.props.id);
          this.props.uiActions.closeModalWindow();
        }}
      >{content}</ConfirmDialog>
    );
    this.props.uiActions.openModalWindow(dialog);
  }

  toggleEditting() {
    // if edit post is initialed then close the comment editor
    let isCommentInputVisible = this.state.isCommentInputVisible;
    if (!this.state.isEditting) {
      isCommentInputVisible = false;
    }
    this.setState({isEditting: !this.state.isEditting, isCommentInputVisible: isCommentInputVisible});
  }

  renderReview(review, coverImages, works) {
    const work = works[review.pid] || {};

    return (
      <FeaturePreview>
        <div>
          <img src={coverImages.pids[review.pid]} />
          <p><strong>{work.title}</strong> - {work.creator}</p>
          <div>
            <span dangerouslySetInnerHTML={{__html: review.html}} />
          </div>
        </div>
      </FeaturePreview>
    );
  }

  render() {
    const {
            groupActions,
            content,
            html,
            image,
            video,
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

    const youtube = ExtractYoutubeID(content);

    const isLikedByCurrentUser = includes(this.props.likes, this.props.profile.id);

    const likeFunction = (profile.userIsLoggedIn) ? this.likePost : () => {
    };
    const unlikeFunction = (profile.userIsLoggedIn) ? this.unlikePost : () => {
    };

    const likeButton = (
      <LikeButton
        likeFunction={likeFunction}
        unlikeFunction={unlikeFunction}
        usersWhoLikeThis={this.props.likes}
        isLikedByCurrentUser={isLikedByCurrentUser}
        active={profile.userIsLoggedIn}
      />
    );

    const flagFunction = () => {
      this.props.uiActions.openModalWindow(postFlagModalContent);
    };
    let flagButton = null;
    if (profile.userIsLoggedIn) {
      flagButton = (
        <TinyButton
          clickFunction={flagFunction}
          icon={<Icon glyph={flagSvg} className="icon flag-post--button" />}
        />
      );
    }

    return (
      <div className='post--wrapper' >
        <div className='post--profile-image' >
          <a href={`/profil/${owner.id}`} >
            <img src={owner.image || null} alt={owner.displayName} />
          </a>
        </div>
        <div className='post' >
          <div className='post--header' >
            <a href={`/profil/${owner.id}`} ><span className='username' dangerouslySetInnerHTML={{__html: owner.displayName}} /></a>
            <span className='time' >{this.state.isEditting && 'Retter nu' || TimeToString(timeCreated)}</span>
            <span className='buttons' >
              {(profile.id === owner.id || profile.isModerator) &&
              <TinyButton active={this.state.isEditting} clickFunction={() => this.toggleEditting()}
                          icon={<Icon glyph={pencilSvg} className="icon edit-post--button"/>} />
              ||
              flagButton
              }
            </span>
          </div>
          {
            this.state.isEditting &&
            <ContentAdd redirectTo={`/grupper/${groupId}`} profile={profile} parentId={groupId} type="post" getMoreWorks={this.props.getMoreWorks}
                        abort={() => this.toggleEditting()} text={content} image={image} id={id} works={this.props.works}
                        delete={() => this.deletePost()} addContentAction={groupActions.editPost} coverImages={this.props.coverImages} />
            ||
            <div className='post--content-wrapper' >
              {
                <p className='post--content' dangerouslySetInnerHTML={{__html: html}} /> // eslint-disable-line
              }
              {this.props.review && this.renderReview(this.props.review, this.props.coverImages, this.props.works)}
              {
                image &&
                <div className='post--media' >
                  <a href={image.replace('medium', 'original')} target="_blank" ><img src={image} alt="image for post" /></a>
                </div>
              }
              {
                video && video.resolutions.length ? getVideoPlayer(this.props.video) : null
              }
              {
                youtube &&
                <div className="post--youtube-container" >
                  <Youtube videoId={youtube[0]} />
                </div>
              }
            </div>
          }
          <CommentList comments={comments} profile={profile} groupId={groupId} postId={id} getMoreWorks={this.props.getMoreWorks}
                       submitFlagFunction={this.submitCommentFlag} uiActions={this.props.uiActions}
                       groupActions={this.props.groupActions} works={this.props.works} coverImages={this.props.coverImages} />
          {commentsCount > numberOfCommentsLoaded &&
          <div className="post--load-more-comments" >
            <ExpandButton isLoading={loadingComments}
                          onClick={() => groupActions.asyncShowMoreComments(id, numberOfCommentsLoaded, 10)}
                          text="Vis flere" />
              <span className="post--comment-count" >
                {commentsCount} {commentsCount === 1 && 'kommentar' || 'kommentarer'}
              </span>
          </div>
          }
          {
            this.state.isCommentInputVisible &&
            <ContentAdd redirectTo={this.props.commentRedirect || `/grupper/${groupId}`} profile={profile} parentId={id}
                        type="comment" works={this.props.works} coverImages={this.props.coverImages}
                        abort={() => this.toggleCommentInput()} getMoreWorks={this.props.getMoreWorks}
                        addContentAction={groupActions.addComment}
                        autofocus={true}
            />
            ||
            <a className="post--add-comment-button" href="#add-comment"
               onClick={e => this.toggleCommentInput(e)} ><Icon glyph={backSvg} />Svar</a>
          }
          {likeButton}
        </div>
      </div>
    );
  }
}

PostView.propTypes = {
  commentsCount: React.PropTypes.number,
  commentRedirect: React.PropTypes.string,
  comments: React.PropTypes.array,
  content: React.PropTypes.string,
  html: React.PropTypes.string,
  flagActions: React.PropTypes.object.isRequired,
  groupActions: React.PropTypes.object,
  groupId: React.PropTypes.number,
  id: React.PropTypes.number,
  image: React.PropTypes.string,
  likes: React.PropTypes.array,
  loadingComments: React.PropTypes.bool,
  owner: React.PropTypes.object,
  profile: React.PropTypes.object.isRequired,
  timeCreated: React.PropTypes.string,
  uiActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  numberOfCommentsLoaded: React.PropTypes.number,
  review: React.PropTypes.object,
  works: React.PropTypes.object.isRequired,
  coverImages: React.PropTypes.object.isRequired,
  getCoverImage: React.PropTypes.func.isRequired,
  getMoreWorks: React.PropTypes.func,
  video: React.PropTypes.object
};
