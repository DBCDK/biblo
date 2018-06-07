/* eslint-disable react/no-danger */

import './scss/PostView.scss';

import React from 'react';
import PropTypes from 'prop-types';
import TimeToString from '../../../Utils/timeToString.js';
import {parseStringForVideoUrls} from '../../../Utils/parseStringForVideoUrls';
import AddContent from '../AddContent/AddContent.component';
import {CommentList} from '../Comments/CommentList.component';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';
import LikeButton from '../../General/LikeButton/LikeButton.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import ConfirmDialog from '../../General/ConfirmDialog/ConfirmDialog.component.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';
import {getVideoPlayer} from '../General/GroupDisplayUtils';
import ReviewRow from '../../Profile/Detail/ReviewRow.component';
import {PDFViewComponent} from './PDFView.component';
import sanitizeHtml from './../../../Utils/sanitizeHtml.util';

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
    this.setState({
      isCommentInputVisible: !this.state.isCommentInputVisible,
      isEditting: isEditing
    });
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
        <p>Du er ved at slette et indlæg, du selv har skrevet. Hvis andre brugere har svaret på dit indlæg, vil det også
          blive slettet.</p>
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
    this.setState({
      isEditting: !this.state.isEditting,
      isCommentInputVisible: isCommentInputVisible
    });
  }

  renderReview(review, coverImages, works, profile, likeActions) {
    const work = works[review.pid] || {};

    return (
      <div className="attached-review--container">
        <ReviewRow
          activeUser={profile}
          metadata={{
            coverUrl: coverImages.pids[review.pid],
            dcTitle: work.title,
            dcTitleFull: work.title,
            workType: work.workType
          }}
          likeActions={likeActions}
          review={review} />
      </div>
    );
  }

  renderCampaignLogo(campaign, timeCreated) {
    if (campaign && campaign.startDate && campaign.endDate) {
      try {
        const postCreate = new Date(timeCreated);
        const campaignStart = new Date(campaign.startDate);
        const campaignEnd = new Date(campaign.endDate);

        const isInCampaign = postCreate >= campaignStart && postCreate <= campaignEnd;

        if (isInCampaign && campaign.logos && campaign.logos.svg) {
          return <Icon height={40} width={40} svgLink={campaign.logos.svg} />;
        }
      }
      catch (er) {
        return <span className="campaign--logo--error" />;
      }
    }

    return <span />;
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
      loadingComments,
      likes,
      campaign,
      works,
      review,
      coverImages,
      getMoreWorks,
      commentRedirect,
      likeActions,
      groupIsClosed,
      pdf
    } = this.props;

    const commentsToLoad = commentsCount-1;
    const postFlagModalContent = (
      <CreateFlagDialog
        submitFunction={this.submitPostFlag}
        onClose={uiActions.closeModalWindow}
        contentType={'post'}
        contentId={id}
      />
    );

    const flagFunction = () => uiActions.openModalWindow(postFlagModalContent);
    let flagButton = null;
    if (profile.userIsLoggedIn) {
      const flagIcon = <Icon glyph={flagSvg} className="icon flag-post--button" />;
      flagButton = (
        <TinyButton clickFunction={flagFunction} icon={flagIcon} />
      );
    }

    const videos = parseStringForVideoUrls(content, true);
    const isLikedByCurrentUser = includes(likes, profile.id);
    const likeFunction = (profile.userIsLoggedIn) ? this.likePost : () => {};
    const unlikeFunction = (profile.userIsLoggedIn) ? this.unlikePost : () => {};
    const addPostAllowed = !groupIsClosed || profile.isModerator;
    const editPostAllowed = (profile.id === owner.id && !groupIsClosed) || profile.isModerator;

    const likeButton = (
      <LikeButton
        likeFunction={likeFunction}
        unlikeFunction={unlikeFunction}
        usersWhoLikeThis={likes}
        isLikedByCurrentUser={isLikedByCurrentUser}
        active={profile.userIsLoggedIn}
      />
    );

    return (
      <div className='post--wrapper'>
        <div className='post--profile-image'>
          <a href={`/profil/${owner.id}`}>
            <img src={owner.image || null} alt={owner.displayName} />
          </a>
        </div>
        <div className='post'>
          <div className='post--header'>
            <a href={`/profil/${owner.id}`}>
              <span className='username' dangerouslySetInnerHTML={{__html: sanitizeHtml(owner.displayName)}} />
            </a>
            <span className='time'>{this.state.isEditting && 'Retter nu' || TimeToString(timeCreated)}</span>
            <span className='buttons'>
              <span className="post--campaign--logo">
                {this.renderCampaignLogo(campaign, timeCreated)}
              </span>
              {editPostAllowed &&
              <TinyButton
                active={this.state.isEditting}
                clickFunction={() => this.toggleEditting()}
                icon={<Icon glyph={pencilSvg} className="icon edit-post--button" />}
              />
              ||
              flagButton
              }
            </span>
          </div>
          {
            this.state.isEditting &&
            <AddContent
              redirectTo={`/grupper/${groupId}`}
              profile={profile}
              parentId={groupId}
              type="post"
              getMoreWorks={getMoreWorks}
              abort={() => this.toggleEditting()}
              text={content}
              image={image}
              pdf={pdf}
              id={id}
              works={works}
              delete={() => this.deletePost()}
              addContentAction={groupActions.editPost}
              coverImages={coverImages}
              pdfUploads={true}
              editing={true}
            />
            ||
            <div className='post--content-wrapper'>
              {
                <p className='post--content' dangerouslySetInnerHTML={{__html: sanitizeHtml(html)}} /> // eslint-disable-line
              }
              {review && this.renderReview(review, coverImages, works, profile, likeActions)}
              {
                image &&
                <div className='post--media'>
                  <a href={image.replace('medium', 'original')} target="_blank">
                    <img src={image} alt="image for post" />
                  </a>
                </div>
              }
              {
                video && video.resolutions.length ? getVideoPlayer(video) : null
              }
              {
                videos.length >= 1 &&
                videos.map((embeddedVideo, index) => {
                  return (
                    <div key={index} className="post--video-container">
                      {embeddedVideo}
                    </div>
                  );
                })
              }
              {
                pdf && <PDFViewComponent pdf={pdf} isOwner={editPostAllowed} />
              }
            </div>
          }
          <CommentList
            comments={comments}
            profile={profile}
            groupId={groupId}
            postId={id}
            getMoreWorks={getMoreWorks}
            submitFlagFunction={this.submitCommentFlag}
            uiActions={uiActions}
            groupActions={groupActions}
            works={works}
            coverImages={coverImages}
            deleteAction={commentId => this.props.groupActions.callServiceProvider('deleteComment', {id: commentId})}
          />
          {commentsCount > numberOfCommentsLoaded &&
          <div className="post--load-more-comments">
            <ExpandButton
              isLoading={loadingComments}
              onClick={() => groupActions.asyncShowMoreComments(id, numberOfCommentsLoaded, 10)}
              text="Vis flere"
            />
            <span className="post--comment-count">
              {commentsToLoad} {commentsToLoad === 1 && 'kommentar' || 'kommentarer'}
            </span>
          </div>
          }
          {!this.state.isEditting && <span> {
            this.state.isCommentInputVisible &&
            <AddContent
              redirectTo={commentRedirect || `/grupper/${groupId}`}
              profile={profile}
              parentId={id}
              type="comment"
              works={works}
              coverImages={coverImages}
              abort={() => this.toggleCommentInput()}
              getMoreWorks={getMoreWorks}
              addContentAction={groupActions.addComment}
              autofocus={true}
              displayAbortButton={true}
            />
            ||
            <a
              className={`post--add-comment-button${addPostAllowed ? '' : '-disabled'}`}
              href="#add-comment"
              onClick={e => addPostAllowed && this.toggleCommentInput(e)}>
              <Icon glyph={backSvg}
              />
              Svar
            </a>
          }
          {likeButton}
          </span>}
        </div>
      </div>
    );
  }
}

PostView.displayName = 'PostView';
PostView.propTypes = {
  campaign: PropTypes.object,
  commentsCount: PropTypes.number,
  commentRedirect: PropTypes.string,
  comments: PropTypes.array,
  content: PropTypes.string,
  html: PropTypes.string,
  flagActions: PropTypes.object.isRequired,
  groupActions: PropTypes.object,
  groupId: PropTypes.number,
  id: PropTypes.number,
  image: PropTypes.string,
  likes: PropTypes.array,
  loadingComments: PropTypes.bool,
  owner: PropTypes.object,
  profile: PropTypes.object.isRequired,
  timeCreated: PropTypes.string,
  uiActions: PropTypes.object.isRequired,
  likeActions: PropTypes.object.isRequired,
  numberOfCommentsLoaded: PropTypes.number,
  review: PropTypes.object,
  works: PropTypes.object.isRequired,
  coverImages: PropTypes.object.isRequired,
  getCoverImage: PropTypes.func.isRequired,
  getMoreWorks: PropTypes.func,
  video: PropTypes.object,
  groupIsClosed: PropTypes.bool,
  pdf: PropTypes.object
};

PostView.defaultProps = {
  campaign: {
    logos: {}
  },
  comments: [],
  profile: {},
  owner: {}
};
