/* eslint-disable react/no-danger */

import './scss/comment-view.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import ExtractYoutubeID from '../../../Utils/extractYoutubeID';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import CreateFlagDialog from '../Flags/CreateFlagDialog.component.js';
import ContentAdd from '../AddContent/AddContent.component.js';
import {getVideoPlayer} from '../General/GroupDisplayUtils';

import Youtube from 'react-youtube';

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

  renderReview(review) {
    return (
      <div key={`comment_review_${review.id}`}>
        <img src={`/images/covers/${review.worktype}.png`} />
        <span dangerouslySetInnerHTML={{__html: review.html}} />
      </div>
    );
  }

  render() {
    const {id, content, html, image, timeCreated, owner, profile, groupId, postId, submitFlagFunction, uiActions, groupActions, review, video} = this.props;

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
          icon={<Icon glyph={flagSvg} className="icon flag-comment--button"/>}
        />
      );
    }

    return (
      <div className='comment-wrapper' id={`comment_${this.props.id}`} >
        <div className='comment-profile-image' >
          <a href={`/profil/${owner.id}`} >
            <img className='profile-image' src={owner.image || null} alt={owner.displayName} />
          </a>
        </div>
        <div className='comment' >
          <div className='comment--header' >
            <a href={`/profil/${owner.id}`} >
              <span className='username' dangerouslySetInnerHTML={{__html: owner.displayName}} />
            </a>
            <span className='time' >{this.state.isEditting && 'Retter nu' || TimeToString(timeCreated)}</span>
          </div>

          <div className='comment--actions' >
            {(profile.id === owner.id || profile.isModerator) &&
            <TinyButton active={this.state.isEditting} clickFunction={() => this.toggleEditting()}
                        icon={<Icon glyph={pencilSvg} className="icon edit-comment--button"/>} />
            ||
            flagButton
            }
          </div>
          {
            this.state.isEditting &&
            <ContentAdd redirectTo={`/grupper/${groupId}`} profile={profile} parentId={postId} type="comment" getMoreWorks={this.props.getMoreWorks}
                        abort={() => this.toggleEditting()} text={content} image={image} id={id} autofocus={true}
                        addContentAction={groupActions.editComment} coverImages={this.props.coverImages} works={this.props.works} />
            ||
            <div className="comment--content" >
              {
                <p className='content' dangerouslySetInnerHTML={{__html: html}} /> // eslint-disable-line
              }
              {review && this.renderReview(review)}
              {
                image &&
                <div className='media' >
                  <a href={image.replace('medium', 'original')} target="_blank" ><img src={image} alt="image for post" /></a>
                </div>
              }
              {
                video && video.resolutions.length ? getVideoPlayer(this.props.video) : null
              }
              {
                youtube &&
                <div className="comment--youtube-container" >
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
  uiActions: React.PropTypes.object.isRequired,
  coverImages: React.PropTypes.object.isRequired,
  works: React.PropTypes.object.isRequired,
  getMoreWorks: React.PropTypes.func,
  review: React.PropTypes.object,
  video: React.PropTypes.object
};
