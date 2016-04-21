import React from 'react';

import TimeToString from '../../Utils/timeToString.js';
import ExtractYoutubeID from '../../Utils/extractYoutubeID';

import Message from '../General/Message/Message.component.js';
import Rating from '../General/Rating/Rating.component';
import './Review.scss';

import Login from '../General/Login/Login.component.js';
import LikeButton from '../General/LikeButton/LikeButton.component.js';
import Icon from '../General/Icon/Icon.component.js';
import TinyButton from '../General/TinyButton/TinyButton.component.js';
import {getVideoPlayer} from '../Groups/General/GroupDisplayUtils';
import CreateFlagDialog from '../Groups/Flags/CreateFlagDialog.component.js';
import Youtube from 'react-youtube';

import flagSvg from '../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../General/Icon/svg/functions/pencil.svg';
import videoSvg from '../General/Icon/svg/functions/video.svg';
import cameraSvg from '../General/Icon/svg/functions/camera.svg';
import spinner from '../General/Icon/svg/spinners/loading-spin.svg';

import {includes} from 'lodash';
import Classnames from 'classnames';

export default class Review extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: props.profile,
      owner: props.owner,
      content: props.content,
      rating: props.rating,
      worktype: props.worktype,
      reviewownerid: props.reviewownerid,
      id: props.id,
      pid: props.pid,
      image: props.image,
      video: props.video,
      modified: props.modified,
      created: props.created,
      isEditing: props.isEditing || false,
      attachment: {
        image: props.image || null,
        video: null
      },
      isLoading: false
    };

    this.submitReviewFlag = this.submitReviewFlag.bind(this);
    this.likeReview = this.likeReview.bind(this);
    this.unlikeReview = this.unlikeReview.bind(this);
   // this.deleteReview = this.deleteReview.bind(this);
  }

  toggleEditing() {
    let isCommentInputVisible = this.state.isCommentInputVisible;
    if (!this.state.isEditing) {
      isCommentInputVisible = false;
    }
    this.setState({isEditing: !this.state.isEditing, isCommentInputVisible: isCommentInputVisible});
    return true;
  }

  submitReviewFlag(flag) { // eslint-disable-line
    flag.flagger = this.props.profile.id;
    this.props.flagActions.flagReview(flag);
  }

  likeReview() {
    this.props.likeActions.likeReview({
      reviewId: this.props.id,
      profileId: this.props.profile.id
    });

  }

  unlikeReview() {
    this.props.likeActions.unlikeReview({
      reviewId: this.props.id,
      profileId: this.props.profile.id
    });
  }

  validate() {
    let errors = [];
    if (typeof this.state.rating === 'undefined' || this.state.rating <= 0) {
      errors.push(
        {
          field: 'rating',
          errorMessage: 'Du skal give stjerner'
        });
    }

    if (typeof this.state.content === 'undefined' | this.state.content === '') {
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

  onRatingChange(val) {
    this.setState({
      rating: val
    });
  }

  onAbort(event) {
    if (this.abortXHR) {
      this.abortXHR();
    }
    if (this.props.abort) {
      this.props.abort(event);
    }
    this.setState({content: '', attachment: {image: null, video: null}});
    this.abortXHR = null;
  }

  readInput(input) { // eslint-disable-line consistent-return
    if (input.target.files && input.target.files[0]) {
      const file = input.target.files[0];
      const type = file.type.split('/')[0];
      if (type !== 'image' && type !== 'video') {
        return false;
      }

      if (type === 'image') {
        this.handleImage(file);
      }

      if (type === 'video') {
        this.handleVideo(file);
      }
    }
  }

  handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment = {image: e.target.result, video: null};
      this.setState({attachment: attachment});
    };
    reader.readAsDataURL(file);
  }

  handleVideo(file) {
    file.progress = 0;
    const attachment = {image: null, video: {file: file}};
    this.setState({attachment: attachment});
    this.uploadVideoFile(file);
  }

  uploadVideoFile(file) {
    const form = new FormData();
    form.append('video', file);

    const XHR = new XMLHttpRequest();
    XHR.open('post', '/anmeldelse/api/uploadmedia');
    XHR.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
        let attachment = this.state.attachment;
        attachment.video.file.progress = percentage;
        this.setState({attachment: attachment});
      }
    };

    XHR.onerror = (e) => {
      console.error('Some error occurred', e); // eslint-disable-line no-console
      this.abortXHR = null;
    };

    XHR.onload = (e) => {
      this.abortXHR = null;
      if (e.target.status === 200) {
        this.refs.fileInput.value = null;
      }
      else {
        console.error('Some error occurred', e.target); // eslint-disable-line no-console
      }
    };

    this.abortXHR = () => XHR.abort();
    XHR.send(form);
  }

  clearImage(e) {
    e.preventDefault();
    let attachment = this.state.attachment;
    attachment.image = null;

    if (this.refs.fileInput.value) {
      this.refs.fileInput.value = null;
      this.setState({attachment: attachment});
    }
    else {
      this.setState({attachment: attachment, imageRemoved: true});
    }
  }

  onSubmit(evt) {
    evt.preventDefault();

    if (this.validate()) {
      if (XMLHttpRequest && FormData) {
        this.setState({isLoading: true});
        let form = this.refs.contentForm;
        let formData = new FormData(form);
        var request = new XMLHttpRequest();
        request.open('post', '/anmeldelse/');
        request.onload = (event) => {
          if (event.target.status === 200) {
            const addContentReponse = JSON.parse(event.target.response);
            if (addContentReponse.errors && addContentReponse.errors.length > 0) {
              this.setState({
                isLoading: false,
                errorMsg: addContentReponse.errors[0].errorMessage
              });
            }
            else {
              this.setState({
                isLoading: false,
                isEditing: false
              });
              // if (this.props.abort) {
              //  this.props.abort();
              // }
              // else {
              //  this.setState({content: '', attachment: {image: null, video: null}});
              // }
            }
          }
          else {
            this.setState({
              isLoading: false,
              errorMsg: 'Hmm. Vi kunne desvære ikke oprette din anmeldelse - prøv igen'
            });
          }
        };
        request.send(formData);
      }
    }
    return false;
  }

  render() {
    const {
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

  //  console.log("reviews:", this.props);
    const errorObj = {};
    if (errors) {
      errors.forEach((error) => {
        errorObj[error.field] = (
          <Message type='error'>
            <span className={error.field}> {error.errorMessage} </span>
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
      this.props.uiActions.openModalWindow(reviewFlagModalContent);
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

    // AddContentArea:
    if (!this.props.profile.userIsLoggedIn || !this.props.profile.hasFilledInProfile) {
      return (
        <div className='content-add'>
          <Login>Log ind for at skrive et indlæg</Login>
        </div>
      );
    }

    const youtube = ExtractYoutubeID(content);
    const uniqueId = `upload-media-review-${this.props.id || this.props.parentId}`;
    const progressStatusClass = this.state.attachment.video && this.state.attachment.video.file.progress === 100 ? 'done' : '';
    const isLikedByCurrentUser = includes(this.props.likes, this.props.profile.id);
    const likeFunction = (profile.userIsLoggedIn) ? this.likeReview : () => {
    };
    const unlikeFunction = (profile.userIsLoggedIn) ? this.unlikeReview : () => {
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

    return (
      <div className='review-wrapper'>
        <div className='review--profile-image'>
          <a href={`/profil/${owner.id}`}>
            <img src={owner.image || null} alt={owner.displayName}/>
          </a>
        </div>

        <div className='review'>
          <div className='review--header'>
            <a href={`/profil/${owner.id}`}><span className='username'
                                                  dangerouslySetInnerHTML={{__html: owner.displayName}}/></a>
            <span className='time'>{this.state.isEditing && 'Retter nu' || TimeToString(created)}</span>
            <span className='buttons'>
              {(profile.id === owner.id || profile.isModerator) &&
              <TinyButton active={this.state.isEditing} clickFunction={() => this.toggleEditing()}
                          icon={<Icon glyph={pencilSvg} className="icon edit-post--button"/>}/>
              ||
              flagButton
              }
            </span>
          </div>

          <Rating ref="rating" pid={pid} rating={rating} onChange={ (this.state.isEditing) ? this.onRatingChange.bind(this) : null }/>
          {errorObj.rating || ''}
          {
            this.state.isEditing &&
            <div className={Classnames({'review-add': true, shakeit: this.state.errorMsg})}>
              <form method="post" action='/anmeldelse/' ref="contentForm" onSubmit={(e) => this.onSubmit(e)}>
                <div className='review-add--input'>
                   <textarea className="review-add--textarea" ref='contentTextarea' name="content"
                             placeholder='Skriv din anmeldelse her'
                             value={this.state.content}
                             onChange={(e) => this.setState({content: e.target.value})}
                   />
                  <input type="hidden" name="id" value={this.state.id}/>
                  <input type="hidden" name="pid" value={this.state.pid}/>
                  <input type="hidden" name="worktype" value={this.state.worktype}/>
                  <input type="hidden" name="rating" value={this.state.rating}/>
                  <input type="hidden" name="libraryid" value="1"/>

                  {this.state.attachment.image &&
                  <div className='review-add--preview-image'>
                    <img src={this.state.attachment.image} alt="preview"/>
                    <a href="#removeImage" className="review-add--remove-media" onClick={(e) => this.clearImage(e)}>
                      <Icon glyph={close}/>
                    </a>
                  </div>
                  }

                  <div className='preview-video'>
                    {this.state.attachment.video &&
                    <div>
                      <span className="preview-video--name">{this.state.attachment.video.file.name}</span>
                      <progress className={progressStatusClass} max="100"
                                value={this.state.attachment.video.file.progress || 0}/>
                    </div>
                    }
                  </div>
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
                    disabled={this.state.attachment.video && this.state.attachment.video.file.progress > 0
                     && this.state.attachment.video.file.progress < 100 || this.state.isLoading}
                  >
                    {(this.state.isLoading) && <Icon glyph={spinner}/>}
                    OK
                  </button>
                  {
                    (this.props.abort || (this.state.attachment.video && this.state.attachment.video.file.progress > 0 && this.state.attachment.video.file.progress < 100)) &&
                    <input ref="about" type="reset" className='button alert' onClick={this.onAbort.bind(this)}
                           value="Fortryd"/>
                  }
                  <div className='review-add--media'>
                    <label htmlFor={uniqueId}>
                      <input
                        id={uniqueId}
                        accept='image/*,video/*'
                        type="file"
                        className="review-add--upload-media droppable-media-field--file-input"
                        name="image"
                        onChange={(event) => this.readInput(event)}
                        ref="fileInput"
                      />
                      <Icon glyph={videoSvg}/>
                      <Icon glyph={cameraSvg}/>
                      <span className="review-add--media-label">Upload</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
            ||
            <div className='review--content-wrapper'>
              {
                <p className='review--content' dangerouslySetInnerHTML={{__html: content}}/> // eslint-disable-line
              }
              {
                image &&
                <div className='review--media'>
                  <a href={image.replace('medium', 'original')} target="_blank"><img src={image}
                                                                                     alt="image for review"/></a>
                </div>
              }
              {
                video && video.resolutions.length ? getVideoPlayer(this.props.video) : null
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
  }
}

Review.displayName = 'Review';
Review.propTypes = {
  owner: React.PropTypes.object, // for profile image in view
  profile: React.PropTypes.object.isRequired, // for editing, flagging, liking
  id: React.PropTypes.number,
  reviewownerid: React.PropTypes.number,
  pid: React.PropTypes.string.isRequired,
  isEditing: React.PropTypes.bool,
  worktype: React.PropTypes.string,  // term.workType (manifestationsniveau)
  content: React.PropTypes.string,
  rating: React.PropTypes.number,
  reviewActions: React.PropTypes.object.isRequired,
  timeCreated: React.PropTypes.string,
  image: React.PropTypes.object,
  video: React.PropTypes.object,
  flagActions: React.PropTypes.object,
  likes: React.PropTypes.array,
  likeActions: React.PropTypes.object,
  uiActions: React.PropTypes.object.isRequired,
  errors: React.PropTypes.array
};
