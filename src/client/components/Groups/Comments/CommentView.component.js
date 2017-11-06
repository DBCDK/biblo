/* eslint-disable react/no-danger */

import './scss/comment-view.scss';

import React from 'react';
import PropTypes from 'prop-types';
import TimeToString from '../../../Utils/timeToString.js';
import ExtractYoutubeID from '../../../Utils/extractYoutubeID';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';
import ContentAdd from '../AddContent/AddContent.component.js';
import {getVideoPlayer} from '../General/GroupDisplayUtils';
import ConfirmDialog from '../../General/ConfirmDialog/ConfirmDialog.component.js';
import sanitizeHtml from './../../../Utils/sanitizeHtml.util';

import Youtube from 'react-youtube';

import flagSvg from '../../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

export default class CommentView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEditting: false
    };

    this.deleteComment = this.deleteComment.bind(this);
  }

  toggleEditting() {
    this.setState({isEditting: !this.state.isEditting});
  }

  renderReview(review) {
    return (
      <div key={`comment_review_${review.id}`}>
        <img src={`/images/covers/${review.worktype}.png`} />
        <span dangerouslySetInnerHTML={{__html: sanitizeHtml(review.html)}} />
      </div>
    );
  }

  deleteComment() {
    const dialog = (
      <ConfirmDialog
        cancelButtonText={'Fortryd'}
        confirmButtonText={'Slet kommentar'}
        cancelFunc={this.props.uiActions.closeModalWindow}
        confirmFunc={() => {
          this.props.deleteAction(this.props.id);
          location.reload();
        }}
      >
        <div>
          <p>Du er ved at slette en kommentar, du selv har skrevet. Er du sikker på du vil slette kommentaren?</p>
        </div>
      </ConfirmDialog>
    );

    this.props.uiActions.openModalWindow(dialog);
  }

  render() {
    const {id, content, html, image, timeCreated, owner, profile, groupId, postId, submitFlagFunction, uiActions, groupActions, review, video} = this.props;
    const deleteAction = this.props.deleteAction && this.deleteComment || false;
    const commentFlagModalContent = (
      <CreateFlagDialog
        submitFunction={submitFlagFunction}
        onClose={uiActions.closeModalWindow}
        contentType={'comment'}
        contentId={id}
      />
    );

    const youtube = ExtractYoutubeID(content);

    let flagButton = null;
    if (profile.userIsLoggedIn) {
      flagButton = (
        <TinyButton
          clickFunction={() => {
            uiActions.openModalWindow(commentFlagModalContent);
          }}
          icon={<Icon glyph={flagSvg} className="icon flag-comment--button" />}
        />
      );
    }

    return (
      <div className='comment-wrapper' id={`comment_${this.props.id}`}>
        <div className='comment-profile-image'>
          <a href={`/profil/${owner.id}`}>
            <img className='profile-image' src={owner.image || null} alt={owner.displayName} />
          </a>
        </div>
        <div className='comment'>
          <div className='comment--header'>
            <a href={`/profil/${owner.id}`}>
              <span className='username' dangerouslySetInnerHTML={{__html: sanitizeHtml(owner.displayName)}} />
            </a>
            <span className='time'>{this.state.isEditting && 'Retter nu' || TimeToString(timeCreated)}</span>
          </div>

          <div className='comment--actions'>
            {(profile.id === owner.id || profile.isModerator) &&
            <TinyButton active={this.state.isEditting} clickFunction={() => this.toggleEditting()}
                        icon={<Icon glyph={pencilSvg} className="icon edit-comment--button" />} />
            ||
            flagButton
            }
          </div>
          {
            this.state.isEditting &&
            <ContentAdd
              redirectTo={`/grupper/${groupId}`}
              profile={profile}
              parentId={postId}
              type="comment"
              getMoreWorks={this.props.getMoreWorks}
              abort={() => this.toggleEditting()}
              text={content}
              image={image}
              id={id}
              autofocus={true}
              addContentAction={groupActions.editComment}
              coverImages={this.props.coverImages}
              works={this.props.works}
              delete={deleteAction}
            />
            ||
            <div className="comment--content">
              {
                <p className='content' dangerouslySetInnerHTML={{__html: sanitizeHtml(html)}} /> // eslint-disable-line
              }
              {review && this.renderReview(review)}
              {
                image &&
                <div className='media'>
                  <a href={image.replace('medium', 'original')} target="_blank"><img src={image} alt="image for post" /></a>
                </div>
              }
              {
                video && video.resolutions.length ? getVideoPlayer(this.props.video) : null
              }
              {
                youtube &&
                <div className="comment--youtube-container">
                  <Youtube videoId={youtube[0]} />
                </div>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

CommentView.propTypes = {
  id: PropTypes.number,
  postId: PropTypes.number,
  groupId: PropTypes.number,
  content: PropTypes.string,
  html: PropTypes.string,
  image: PropTypes.string,
  timeCreated: PropTypes.string,
  profile: PropTypes.object,
  owner: PropTypes.object,
  submitFlagFunction: PropTypes.func.isRequired,
  timestamp: PropTypes.string,
  groupActions: PropTypes.object.isRequired,
  uiActions: PropTypes.object.isRequired,
  coverImages: PropTypes.object.isRequired,
  works: PropTypes.object.isRequired,
  getMoreWorks: PropTypes.func,
  review: PropTypes.object,
  video: PropTypes.object,
  deleteAction: PropTypes.func
};
