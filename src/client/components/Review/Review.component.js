/**
 * @file Handle reviews of works. Uploads media like in the groups.
 */
import React from 'react';

import TimeToString from '../../Utils/timeToString.js';
import ExtractYoutubeID from '../../Utils/extractYoutubeID';
import isSiteOpen from '../../Utils/openingHours';

import Message from '../General/Message/Message.component.js';
import Rating from '../General/Rating/Rating.component';
import './Review.scss';

import Login from '../General/Login/Login.component.js';
import LikeButton from '../General/LikeButton/LikeButton.component.js';
import Icon from '../General/Icon/Icon.component.js';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';
import TinyButton from '../General/TinyButton/TinyButton.component.js';
import {getVideoPlayer} from '../Groups/General/GroupDisplayUtils';
import CreateFlagDialog from '../Groups/Flags/CreateFlagDialog.component.js';
import ConfirmDialog from '../General/ConfirmDialog/ConfirmDialog.component.js';
import Youtube from 'react-youtube';

import flagSvg from '../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../General/Icon/svg/functions/pencil.svg';
import videoSvg from '../General/Icon/svg/functions/video.svg';
import cameraSvg from '../General/Icon/svg/functions/camera.svg';
import spinner from '../General/Icon/svg/spinners/loading-spin.svg';
import close from '../General/Icon/svg/functions/close.svg';
import {includes} from 'lodash';
import Classnames from 'classnames';

import UploadMedia from '../General/UploadMedia/UploadMedia.component.js';

export default class Review extends UploadMedia {
  constructor(props) {
    super(props);

    // make sure that we have pids to sort reviews on. ( the /work endpoint can return without work.collection / pids )
    let pids;
    if (props.pids && props.length !== 0) {
      pids = props.pids;
    }
    else {
      pids = [props.pid];
    }

    this.state = {
      profile: props.profile,
      owner: props.owner,
      content: props.content,
      rating: props.rating,
      worktype: props.worktype,
      reviewownerid: props.reviewownerid,
      id: props.id,
      pid: props.pid,
      pids: pids, // NOTE: work.collection from /work can be empty from collection search
      image: props.image,
      video: props.video,
      modified: props.modified,
      created: props.created,
      isEditing: props.isEditing || false,
      attachment: {
        image: {data: props.image || null},
        video: null
      },
      imageId: props.imageId,
      imageRemoveId: null,
      isLoading: false
    };

    this.clearImage = this.clearImage.bind(this);
    this.submitReviewFlag = this.submitReviewFlag.bind(this);
    this.likeReview = this.likeReview.bind(this);
    this.unlikeReview = this.unlikeReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }

  /**
   * enable/disable editing
   *
   * @returns {boolean}
   */
  toggleEditing() {
    this.setState({isEditing: !this.state.isEditing});
    return true;
  }

  /**
   * flag a review
   * @param flag the profile submitting the flag
   */
  submitReviewFlag(flag) { // eslint-disable-line
    flag.flagger = this.props.profile.id;
    this.props.flagActions.flagReview(flag);
  }

  /**
   * like a review
   */
  likeReview() {
    this.props.likeActions.likeReview({
      reviewId: this.props.id,
      profileId: this.props.profile.id
    });
  }

  /**
   * unlike a review
   */
  unlikeReview() {
    this.props.likeActions.unlikeReview({
      reviewId: this.props.id,
      profileId: this.props.profile.id
    });
  }

  /**
   * open a modal window that allows the user to delete a review
   */
  deleteReview() {
    const content = (
      <div>
        <p>Er du sikker på, at du vil slette din anmeldelse?</p>
      </div>
    );

    const dialog = (
      <ConfirmDialog
        cancelButtonText={'Fortryd'}
        confirmButtonText={'Slet anmeldelse'}
        cancelFunc={() => {
          this.props.uiActions.closeModalWindow();
        }}
        confirmFunc={() => {
          this.props.reviewActions.asyncDeleteWorkReview(this.props.id, this.state.pids);
          this.setState({id: null, text: '', attachment: {}});
          this.props.uiActions.closeModalWindow();
        }}
      >{content}</ConfirmDialog>
    );
    this.props.uiActions.openModalWindow(dialog);
  }

  /**
   * choose to overwrite or keep existing review
   */
  overwriteReview (id) {
    const content = (
      <div>
        <p>HOV! Du har vist allerede anmeldt den her. Du må kun lave en. Ønsker du at overskrive?</p>
      </div>
    );

    const dialog = (
      <ConfirmDialog
        cancelButtonText={'Fortryd'}
        confirmButtonText={'Overskriv'}
        cancelFunc={() => {
          this.setState({isLoading: false});
          this.props.uiActions.closeModalWindow();
        }}
        confirmFunc={() => {
          this.setState({id: id},
            () => {
              this.processContent();
              this.props.uiActions.closeModalWindow();
            });
        }}
      >{content}</ConfirmDialog>
    );
    this.props.uiActions.openModalWindow(dialog);
  }

  /**
   * Check if a reviews is s valid
   * @returns {boolean}
   */
  validate() {
    const isModerator = this.state.profile.isModerator;

    let errors = [];
    if (typeof this.state.rating === 'undefined' || this.state.rating <= 0) {
      errors.push(
        {
          field: 'rating',
          errorMessage: 'Du skal give stjerner'
        });
    }

    if (!isModerator && !isSiteOpen()) {
      errors.push(
        {
          field: 'content',
          errorMsg: 'Du kan kun skrive mellem 09:00 og 21:00'
        });
    }
    else if ((typeof this.state.content === 'undefined' || this.state.content === '') &&
      (!(this.state.attachment && this.state.attachment.video))) {
      errors.push({
        field: 'content',
        errorMessage: 'Du skal skrive en anmeldelse eller uploade en video-anmeldelse'
      });
    }

    if (errors.length <= 0) {
      return true;
    }

    this.setState({
      errors: errors
    });
    return false;
  }

  /**
   * handle rating changes
   * @param val
   */
  onRatingChange(val) {
    this.setState({
      rating: val
    });
  }

  /**
   * clear image for the review
   * note: this is overridden her since it is handled differently than in groups
   * @param e
   * @returns {boolean}
   */
  clearImage(e) {
    e.preventDefault();
    let attachment = this.state.attachment;
    attachment.image = null;
    if (this.refs.fileInput.value) {
      this.refs.fileInput.value = null;
      this.setState({
        attachment: attachment,
        imageRemoveId: null
      });
    }
    else {
      this.setState({
        image: null,
        attachment: attachment,
        imageRemoveId: this.state.imageId
      });
    }
    return true;
  }

  afterEdit () {
    this.setState({isEditing: false, isLoading: false});
  }

  /**
   * submit the review. use XHR if available via UploadMedia
   *
   * @param evt
   * @returns {boolean}
   */
  onSubmit(evt) {
    if (XMLHttpRequest && FormData) {
      evt.preventDefault();
    }

    if (this.validate()) {
      if (XMLHttpRequest && FormData) {
        this.processContent()
          .then(() => {
            this.setState({isLoading: true});
          });
      }
    }
    return false;
  }

  processContent () {
    return new Promise((resolve, reject) => {
      this.addContent(this.refs.contentForm, '/anmeldelse/').then((response) => {
        if (response.errors && response.errors.length > 0) {
          this.setState({errorMsg: response.errors[0].errorMessage});
          reject(this.state);
        }
        else {
          if (this.props.ownReview) { // only show the one review
            this.props.reviewActions.asyncShowReview(response.data.id);
          }
          else {
            // we created / edited a review . Restart paging . pass ownReviewId . Send pids (for sorting review list)
            this.props.reviewActions.asyncShowWorkReviews(this.state.pids, 0, 10, response.data.id);
          }
          this.afterEdit();

          if (this.props.toggleReview) {
            this.props.toggleReview(); // action that refreshes screen outside review component (typically a button)
          }
          resolve(this.state);
        }
      }).catch((resp) => {
        let errorMsg = resp.message;
        if (errorMsg === 'Eksisterende anmeldelse') {
          this.overwriteReview(resp.existingReviewId);
          resolve(this.state);
        }
        else {
          this.setState({errorMsg: errorMsg});
          reject(this.state);
        }
      });
    });
  }

  render() {
    let {
      errors,
      pid,
      content,
      rating,
      owner,
      image,
      video,
      profile,
      created
      } = this.state;

    let logo;
    if (this.props.campaign && this.props.campaign.logos) {
      logo = this.props.campaign.logos.small;
    }

    const errorObj = {};
    if (!isSiteOpen() && !profile.isModerator) {
      errors = [];
      errors.push(
        {
          field: 'content',
          errorMessage: 'Du kan kun skrive mellem 09:00 og 21:00'
        });
    }

    if (errors) {
      errors.forEach((error) => {
        errorObj[error.field] = (
          <Message type='error'>
            <span className={`error-${error.field}`}> {error.errorMessage} </span>
          </Message>
        );
      });
    }

    const reviewFlagModalContent = (
      <CreateFlagDialog
        submitFunction={this.submitReviewFlag}
        onClose={this.props.uiActions.closeModalWindow}
        contentType={'review'}
        contentId={this.state.id}
      />
    );

    const flagFunction = () => {
      if (profile.userIsLoggedIn) {
        this.props.uiActions.openModalWindow(reviewFlagModalContent);
      }
      else {
        let dialog = (
          <div>
            <p>Du skal logge ind for at skrive til moderator</p>
            <RoundedButton href={`/login?destination=${encodeURIComponent(window.location)}`} buttonText="Login"
                         compact={false}/>
          </div>
        );
        this.props.uiActions.openModalWindow(dialog);
      }
    };

    let flagButton = (
      <TinyButton
        clickFunction={flagFunction}
        icon={<Icon glyph={flagSvg} className="icon flag-post--button" />}
      />
    );

    let deleteButton;
    if (this.props.id) {
      deleteButton = (<a className="button delete" onClick={() => this.deleteReview()}>
          <span>Slet</span>
        </a>
      );
    }

    if (this.state.isEditing &&(!this.props.profile.userIsLoggedIn || !this.props.profile.hasFilledInProfile)) {
      return (
        <div className='content-add'>
          <Login>Log ind for at skrive en anmeldelse</Login>
        </div>
      );
    }

    let libraryId = '150013-palle';
    if (this.props.profile.favoriteLibrary && this.props.profile.favoriteLibrary.libraryId) {
      libraryId = this.props.profile.favoriteLibrary.libraryId;
    }

    const youtube = ExtractYoutubeID(content);
    const uniqueId = `upload-media-review-${this.props.id || this.props.parentId}`;
    const progressStatusClass = this.state.attachment.video && this.state.attachment.video.file && this.state.attachment.video.file.progress === 100 ? 'done' : '';
    const isLikedByCurrentUser = includes(this.props.likes, this.props.profile.id);
    const likeFunction = (profile.userIsLoggedIn) ? this.likeReview : () => {
      let dialog = (
        <div>
          <p>Du skal logge ind for at like</p>
          <RoundedButton href={`/login?destination=${encodeURIComponent(window.location)}`}
                         buttonText="Login"
                         compact={false}/>
        </div>
      );
      this.props.uiActions.openModalWindow(dialog);
    };
    const unlikeFunction = (this.props.profile.userIsLoggedIn) ? this.unlikeReview : () => {
    };

    const likeButton = (
      <LikeButton
        likeFunction={likeFunction}
        unlikeFunction={unlikeFunction}
        usersWhoLikeThis={this.props.likes}
        isLikedByCurrentUser={isLikedByCurrentUser}
        active={this.props.profile.userIsLoggedIn}
      />
    );

    let ownerimage;
    if (owner.image.url) {
      ownerimage = owner.image.url.medium;
    }
    else {
      ownerimage = owner.image;
    }

    const imageCollectionId = this.state.attachment && this.state.attachment.image && this.state.attachment.image.imageCollectionId;

    /* eslint-disable react/no-danger */
    return (
      <div className='review--wrapper'>
        <div className='review--profile-image'>
          <a href={`/profil/${owner.id}`}>
            <img src={ownerimage || null} alt={owner.displayName}/>
          </a>
        </div>

        <div className='review'>
          <div className='review--header'>
            <a href={`/profil/${owner.id}`}><span className='username'
                                                  dangerouslySetInnerHTML={{__html: owner.displayName}}/></a>
            <span className='time'>{this.state.isEditing && 'Skriver nu' || TimeToString(created)}</span>

            {logo &&
            <img className='logo' src={logo}/>
            }
            <span className='buttons'>
              {(profile.id === owner.id || profile.isModerator) &&
              <TinyButton active={this.state.isEditing} clickFunction={() => this.toggleEditing()}
                          icon={<Icon glyph={pencilSvg} className="icon edit-post--button"/>}/>
              ||
              flagButton
              }
            </span>
          </div>

          <Rating ref="rating" pid={pid} rating={rating}
                  onChange={(this.state.isEditing) ? this.onRatingChange.bind(this) : null}/>
          {errorObj.rating || ''}
          {this.state.isEditing && errorObj.content}
          {
            this.state.isEditing &&
            <div className={Classnames({'review-add': true, shakeit: errors})}>
              <form
                method="post"
                action='/anmeldelse/'
                ref="contentForm"
                onSubmit={(e) => this.onSubmit(e)}
                encType="multipart/form-data"
              >
                <div className='review-add--input'>
                   <textarea className="review-add--textarea" ref='contentTextarea' name="content"
                             placeholder='Skriv din anmeldelse her'
                             value={this.state.content}
                             onChange={(e) => this.setState({content: e.target.value})}
                   />
                  <input type="hidden" name="id" value={this.state.id || ''}/>
                  <input type="hidden" name="reviewownerid" value={this.state.reviewownerid || ''}/>
                  <input type="hidden" name="imageRemoveId" value={this.state.imageRemoveId || ''}/>
                  <input type="hidden" name="imageId" value={imageCollectionId || ''} />
                  <input type="hidden" name="pid" value={this.state.pid || ''}/>
                  <input type="hidden" name="worktype" value={this.state.worktype || ''}/>
                  <input type="hidden" name="rating" value={this.state.rating || ''}/>
                  <input type="hidden" name="libraryid" value={libraryId || ''}/>
                  {this.state.created && <input type="hidden" name="created" value={this.state.created} />}

                  {this.state.attachment.image && this.state.attachment.image.data &&
                  <div className='review-add--preview-image'>
                    <img src={this.state.attachment.image.data} alt="preview"/>
                    <a href="#removeImage" className="review-add--remove-media" onClick={(e) => this.clearImage(e)}>
                      <Icon glyph={close}/>
                    </a>
                  </div>
                  }

                  {this.state.attachment.video && this.state.attachment.video.file && this.state.attachment.video.file.name &&
                  <div className='preview-video'>
                    {this.state.attachment.video &&
                    <div>
                      <span className="preview-video--name">{this.state.attachment.video.file.name}</span>
                      <progress className={progressStatusClass} max="100"
                                value={this.state.attachment.video.file.progress}/>
                    </div>
                    }
                  </div>
                  }
                </div>
                <div className={Classnames({'content-add--messages': true, fadein: this.state.errorMsg})}>
                  {
                    this.state.errorMsg &&
                    <Message type="error"
                             onClose={() => this.setState({errorMsg: null})}>{this.state.errorMsg}</Message>
                  }
                </div>
                <div className='review-add--actions'>
                  <button
                    type='submit'
                    className='button submit'
                    id='submit-btn'
                    disabled={this.state.attachment.video && this.state.attachment.video.file &&
                      this.state.attachment.video.file.progress > 0
                     && this.state.attachment.video.file.progress < 100 || this.state.isLoading}
                  >
                    {(this.state.isLoading) && <Icon glyph={spinner}/>}
                    OK
                  </button>
                  {
                    (this.props.abort || (this.state.attachment.video && this.state.attachment.video.file
                    && this.state.attachment.video.file.progress > 0
                    && this.state.attachment.video.file.progress < 100)) &&
                    <input ref="about" type="reset" className='button alert' onClick={this.onAbort.bind(this)}
                           value="Fortryd"/>
                  }
                  {deleteButton}

                  <div className='review-add--media'>
                    <label htmlFor={uniqueId}>
                      <Icon glyph={videoSvg}/>
                      <Icon glyph={cameraSvg}/>
                      <span className="review-add--media-label">Upload</span>
                    </label>
                  </div>
                </div>
              </form>

              <input
                id={uniqueId}
                accept='image/*,video/*,video/mp4'
                type="file"
                className="review-add--upload-media droppable-media-field--file-input"
                onChange={event => this.readInput(event, (attachment) => this.setState({attachment: attachment}))
                  .then(attachment=>this.setState({attachment: attachment}))
                  .catch(errorMsg=>this.setState({errorMsg: errorMsg}))
                }
                ref="fileInput"
              />

            </div>
            ||
            <div className='review--content-wrapper'>
              {
                <p className='review--content' dangerouslySetInnerHTML={{__html: this.props.html}}/> // eslint-disable-line
              }
              {
                (image || this.state.attachment.image && this.state.attachment.image.data) &&
                <div className='review--media'>
                  <a href={image && image.replace('medium', 'original')} target="_blank">
                    <img src={this.state.attachment.image.data} alt="image for review"/>
                  </a>
                </div>
              }
              {
                video && video.resolutions && video.resolutions.length ? getVideoPlayer(video) : null
              }
              {
                youtube &&
                <div className="review--youtube-container">
                  <Youtube videoId={youtube[0]}/>
                </div>
              }
              {likeButton}
            </div>
          }
        </div>
      </div>
    );
    /* eslint-enable react/no-danger */
  }
}

Review.displayName = 'Review';
Review.propTypes = {
  owner: React.PropTypes.object,                        // for profile image in view
  profile: React.PropTypes.object.isRequired,           // for editing, flagging, liking
  id: React.PropTypes.number,
  pid: React.PropTypes.string.isRequired,
  pids: React.PropTypes.array,                          // from openplatform work endpoint (optional)
  reviewownerid: React.PropTypes.number,
  logo: React.PropTypes.string,
  isEditing: React.PropTypes.bool,
  worktype: React.PropTypes.string,                     // term.workType (underværksniveau)
  content: React.PropTypes.string,
  rating: React.PropTypes.number,
  reviewActions: React.PropTypes.object.isRequired,
  timeCreated: React.PropTypes.string,
  image: React.PropTypes.string,
  video: React.PropTypes.object,
  flagActions: React.PropTypes.object,
  likes: React.PropTypes.array,
  likeActions: React.PropTypes.object,
  uiActions: React.PropTypes.object.isRequired,
  errors: React.PropTypes.array,
  modified: React.PropTypes.any,
  created: React.PropTypes.any,
  abort: React.PropTypes.any,
  parentId: React.PropTypes.any,
  imageId: React.PropTypes.number,
  toggleReview: React.PropTypes.func,
  ownReview: React.PropTypes.bool
};

