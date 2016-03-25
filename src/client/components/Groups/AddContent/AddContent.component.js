'use strict';

import autosize from 'autosize';
import React from 'react';
import Classnames from 'classnames';

// Components
import Login from '../../General/Login/Login.component';
import Icon from '../../General/Icon/Icon.component';
import Message from '../../General/Message/Message.component';

// SVGs
import cameraSvg from '../../General/Icon/svg/functions/camera.svg';
import videoSvg from '../../General/Icon/svg/functions/video.svg';
import close from '../../General/Icon/svg/functions/close.svg';
import spinner from '../../General/Icon/svg/spinners/loading-spin.svg';

// Styles
import './scss/addContent.scss';

export default class AddContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: props.text || '',
      attachment: {
        image: props.image || null,
        video: null
      },
      imageRemoved: false,
      errorMsg: null,
      target: `/grupper/content/${props.type}`,
      isLoading: false
    };
  }

  componentDidMount() {
    autosize(this.refs.contentTextarea);
    if (this.refs.contentTextarea && this.props.autofocus) {
      this.refs.contentTextarea.focus();
    }
  }

  /**
   * Callback for the submit button on 'group-post-form'
   *
   * @param {Event} e
   */
  onSubmit(e) {

    if (!this.state.text.length && !this.state.attachment.image && !this.state.attachment.video) {
      e.preventDefault();
      this.setState({errorMsg: 'Dit indlæg må ikke være tomt.'});
    }
    else if (XMLHttpRequest && FormData) {
      this.setState({isLoading: true});
      e.preventDefault();
      var request = new XMLHttpRequest();
      request.open('POST', this.state.target);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      request.send(new FormData(e.target));
      request.onload = (event) => {
        this.setState({isLoading: false});
        if (event.target.status === 200) {
          const addContentReponse = JSON.parse(event.target.response);
          console.log(addContentReponse);
          if (addContentReponse.errors && addContentReponse.errors.length > 0) {
            this.setState({errorMsg: addContentReponse.errors[0].errorMessage});
          }
          else {
            this.props.addContentAction();
            if (this.props.abort) {
              this.props.abort();
            }
            else {
              this.setState({text: '', attachment: {image: null, video: null}});
            }
          }
        }
        else {
          this.setState({errorMsg: 'Hmm. Vi kunne desvære ikke oprette dit indlæg - prøv igen'});
        }
      };
    }
  }

  /**
   * Callback for the 'Fortryd'-button on the 'group-post-form'
   */
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

  /**
   * Reads the given input object and handles it depending on the type of input.
   * Expected is either an image or a video
   *
   * @param {Object} input
   * @return {boolean}
   */
  readInput(input) {
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

  /**
   * Handles the given file object as an image
   *
   * @param {File} file
   */
  handleImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const attachment = {image: e.target.result, video: null};
      this.setState({attachment: attachment});
    };

    reader.readAsDataURL(file);
  }

  /**
   * Handles the given file object as a video
   *
   * @param {File} file
   */
  handleVideo(file) {
    file.progress = 0;
    const attachment = {image: null, video: {file: file}};
    this.setState({attachment: attachment});
    this.uploadVideoFile(file);
  }

  /**
   * Uploads the given video file to the server and submits the
   * 'group-post-form' when the upload is completed.
   *
   * @param {File} file
   */
  uploadVideoFile(file) {
    const form = new FormData();
    form.append('video', file);

    const XHR = new XMLHttpRequest();
    XHR.open('post', '/grupper/api/uploadmedia');

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

  render() {
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
      <div className={Classnames({'content-add': true, shakeit: this.state.errorMsg})}>
        <form method="POST" action={this.state.target} encType="multipart/form-data"
              id="content_form_component" ref="group-post-form"
              onSubmit={e => this.onSubmit(e)}>
          <div className='content-add--input'>
            <input type="hidden" name="id" value={this.props.id || null}/>
            <input type="hidden" name="imageRemoved" value={this.state.imageRemoved}/>
            <input type="hidden" className="redirect" name="redirect" value={this.props.redirectTo}/>
            <input type="hidden" name="parentId" value={this.props.parentId}/>
          <textarea className="content-add--textarea" ref='contentTextarea' name="content"
                    placeholder='Gi den gas & hold god tone ;-)'
                    value={this.state.text}
                    onChange={(e) => this.setState({text: e.target.value})}
          />
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
              <Message type="error" onClose={() => this.setState({errorMsg: null})}>{this.state.errorMsg}</Message>
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
      </div>);
  }
}

AddContent.displayName = 'AddContent';
AddContent.propTypes = {
  abort: React.PropTypes.func,
  addContentAction: React.PropTypes.func.isRequired,
  autofocus: React.PropTypes.bool,
  profile: React.PropTypes.object.isRequired,
  parentId: React.PropTypes.number.isRequired,
  redirectTo: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  text: React.PropTypes.string,
  image: React.PropTypes.string,
  id: React.PropTypes.number
};
