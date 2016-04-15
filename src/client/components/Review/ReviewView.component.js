import React from 'react';

import TimeToString from '../../Utils/timeToString.js';
import Message from '../General/Message/Message.component.js';
import Rating from '../General/Rating/Rating.component';
import './ReviewView.scss';

import LikeButton from '../General/LikeButton/LikeButton.component.js';
import Icon from '../General/Icon/Icon.component.js';
import ConfirmDialog from '../General/ConfirmDialog/ConfirmDialog.component.js';
import TinyButton from '../General/TinyButton/TinyButton.component.js';
import ExpandButton from '../General/ExpandButton/ExpandButton.component';
import {getVideoPlayer} from '../Groups/General/GroupDisplayUtils';

import Youtube from 'react-youtube';
import backSvg from '../General/Icon/svg/functions/back.svg';
import flagSvg from '../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../General/Icon/svg/functions/pencil.svg';
import videoSvg from '../General/Icon/svg/functions/video.svg';
import cameraSvg from '../General/Icon/svg/functions/camera.svg';
import spinner from '../General/Icon/svg/spinners/loading-spin.svg';

import {includes} from 'lodash';
import Classnames from 'classnames';


export default class ReviewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: props.owner,
      profile: props.profile,
      content: props.content,
      rating: props.content,
      worktype: props.worktype,
      reviewownerid: props.reviewownerid,
      id: props.id,
      pid: props.pid,
      isEditing: props.profile.id === props.owner.id || props.profile.isModerator,
      attachment: {
        image: props.image || null,
        video: null
      },
      isLoading: false
    };
  }

  toggleEditing() {
    console.log("toggleEditing");
    let isCommentInputVisible = this.state.isCommentInputVisible;
    if (!this.state.isEditing) {
      isCommentInputVisible = false;
    }
    this.setState({isEditing: !this.state.isEditing, isCommentInputVisible: isCommentInputVisible});
    return true;
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
    this.setState({text: '', attachment: {image: null, video: null}});
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

  //TODO: make sure that OK button is disabled while we upload files
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
    //avoid form submit
    evt.preventDefault();

    if (this.validate()) {
      if (XMLHttpRequest && FormData) {
        this.setState({isLoading: true});
        let form = this.refs.contentForm;
        let formData = new FormData(form);
        var request = new XMLHttpRequest();
        request.open('post', '/anmeldelse/');

        request.onload = (event) => {
          this.setState({isLoading: false});
          if (event.target.status === 200) {
            console.log("onSubmit response:", event.target.responseText);
            const addContentReponse = JSON.parse(event.target.response);
            if (addContentReponse.errors && addContentReponse.errors.length > 0) {
              this.setState({errorMsg: addContentReponse.errors[0].errorMessage});
            }
            else {
              //this.props.addContentAction(addContentReponse);
              if (this.props.abort) {
                this.props.abort();
              }
              else {
                this.setState({text: '', attachment: {image: null, video: null}});
              }
            }
          }
          else {
            console.log("fejl!", event.target.response);
            this.setState({errorMsg: 'Hmm. Vi kunne desvære ikke oprette din anmeldelse - prøv igen'});
          }
        };
        request.send(formData);
        return false; //avoid form submit
      }
    }
  }

  render() {
    const {
      errors,
      pid,
      content,
      rating,
      owner,
      profile,
      timeCreated
      } = this.state;

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

    //AddContentArea:
    let deleteButton = null;
    if (this.props.delete) {
      deleteButton = (
        <a className="button delete" onClick={() => this.props.delete()}>
          <span>Slet</span>
        </a>
      );
    }

    if (!this.props.profile.userIsLoggedIn || !this.props.profile.hasFilledInProfile) {
      return (
        <div className='content-add'>
          <Login>Log ind for at skrive et indlæg</Login>
        </div>
      );
    }

    const uniqueId = `upload-media-${this.props.type}-${this.props.id || this.props.parentId}`;
    const progressStatusClass = this.state.attachment.video && this.state.attachment.video.file.progress === 100 ? 'done' : '';

    return (
      <div className='post-wrapper'>
        <div className='post--profile-image'>
          <a href={`/profil/${owner.id}`}>
            <img src={owner.image.url.small || null} alt={owner.displayName}/>
          </a>
        </div>

        <div className='post'>
          <div className='post--header'>
            <a href={`/profil/${owner.id}`}><span className='username'
                                                  dangerouslySetInnerHTML={{__html: owner.displayName}}/></a>
            <span className='time'>{this.state.isEditing && 'Retter nu' || TimeToString(timeCreated)}</span>
            <span className='buttons'>
            </span>
          </div>

          <Rating ref="rating" pid={pid} rating={rating}
                  onChange={this.state.isEditing? this.onRatingChange.bind(this) : null }/>
          {errorObj.rating || ''}
          {
            this.state.isEditing &&
              //BEGIN:AddContentArea
            <div className={Classnames({'content-add': true, shakeit: this.state.errorMsg})}>
              <form method="post" action='/anmeldelse/' ref="contentForm" onSubmit={(e) => this.onSubmit(e)}>
                <div className='content-add--input'>
                   <textarea className="content-add--textarea" ref='contentTextarea' name="content"
                             placeholder='Skriv din anmeldelse her'
                             value={this.state.content}
                             onChange={(e) => this.setState({content: e.target.value})}
                   />
                  <input type="hidden" name="id" value={this.state.id}/>
                  <input type="hidden" name="pid" value={this.state.pid}/>
                  <input type="hidden" name="worktype" value={this.state.worktype}/>
                  <input type="hidden" name="rating" value={this.state.rating}/>

                  {this.state.attachment.image &&
                  <div className='content-add--preview-image'>
                    <img src={this.state.attachment.image} alt="preview"/>
                    <a href="#removeImage" className="content-add--remove-media" onClick={(e) => this.clearImage(e)}>
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
                <div className='content-add--actions'>
                  <button
                    type='submit'
                    className='button submit'
                    id='submit-btn'
                    disabled={this.state.attachment.video && this.state.attachment.video.file.progress > 0 && this.state.attachment.video.file.progress < 100 || this.state.isLoading}
                  >
                    {(this.state.isLoading) && <Icon glyph={spinner}/>}
                    OK
                  </button>
                  {
                    (this.props.abort || (this.state.attachment.video && this.state.attachment.video.file.progress > 0 && this.state.attachment.video.file.progress < 100)) &&
                    <input ref="about" type="reset" className='button alert' onClick={this.onAbort.bind(this)}
                           value="Fortryd"/>
                  }
                  {deleteButton}
                  <div className='content-add--media'>
                    <label htmlFor={uniqueId}>
                      <input
                        id={uniqueId}
                        accept='image/*,video/*'
                        type="file"
                        className="content-add--upload-media droppable-media-field--file-input"
                        name="image"
                        onChange={(event) => this.readInput(event)}
                        ref="fileInput"
                      />
                      <Icon glyph={videoSvg}/>
                      <Icon glyph={cameraSvg}/>
                      <span className="content-add--media-label">Upload</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
              //END:AddContentArea
            ||
            <div className={'post--content'}>
            <textarea
              classNAme="content-add--preview-image"
              ref="contentTextArea"
              name="content"
              required
              rows="5"
              value={content}
            />
              {errorObj.content || ''}
            </div>
          }
        </div>
      </div>
    );
  }
}

ReviewView.displayName = 'ReviewView';
ReviewView.propTypes = {
  owner: React.PropTypes.object, //for profile image in view
  profile: React.PropTypes.object.isRequired, // for editing, flagging, liking
  id: React.PropTypes.number,
  pid: React.PropTypes.string.isRequired,
  worktype: React.PropTypes.string.isRequired,
  content: React.PropTypes.string,
  rating: React.PropTypes.number,
  reviewActions: React.PropTypes.object.isRequired,
  timeCreated: React.PropTypes.string,
  // image: React.PropTypes.String,
  // video: React.PropTypes.object,
  // flagActions: React.PropTypes.object,
  // likes: React.PropTypes.array,
  // likeActions: React.PropTypes.object,
  errors: React.PropTypes.array
};
