'use strict';

import autosize from 'autosize';
import React from 'react';

// Components
import Login from '../../General/Login/Login.component';
import Icon from '../../General/Icon/Icon.component';

// SVGs
import cameraSvg from '../../General/Icon/svg/functions/camera.svg';
import videoSvg from '../../General/Icon/svg/functions/video.svg';
import close from '../../General/Icon/svg/functions/close.svg';

// Styles
import './scss/addContent.scss';

export default class AddContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: props.text || '',
      attachment: {
        image: props.image || null,
        video: null,
        video_file: null
      },
      imageRemoved: false
    };
  }

  componentDidMount() {
    autosize(this.refs.postTextarea);
  }

  /**
   * Callback for the submit button on 'group-post-form'
   *
   * @param {Event} e
   */
  onSubmit(e) {
    if (!this.state.text.length) {
      e.preventDefault();
      alert('Dit indlæg skal indeholde tekst'); // eslint-disable-line no-alert
    }

    if (this.state.attachment.video) {
      e.preventDefault();
      this.uploadVideoFile(this.state.attachment.video.file);
    }
  }

  /**
   * Programmatically submits the 'group-post-form'
   */
  submitForm() {
    this.refs['group-post-form'].submit();
  }

  /**
   * Callback for the 'Fortryd'-button on the 'group-post-form'
   */
  onAbort() {
    if (this.abortXHR) {
      this.abortXHR();
    }

    if (this.props.abort) {
      this.props.abort();
    }

    this.setState({text: '', attachment: {image: null, video: null, video_file: null}});
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
      const attachment = {image: e.target.result, video: null, video_file: null};
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
    const attachment = {image: null, video: {file: file}, video_file: null};
    this.setState({attachment: attachment});
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
      try {
        const response = JSON.parse(e.target.response);
        let attachment = this.state.attachment;

        attachment.video_file = response.file;
        attachment.video = null;
        this.setState({attachment: attachment});

        this.refs.fileInput.value = null;
        this.submitForm();

      }
      catch (err) { // eslint-disable-line no-catch-shadow
        console.error('Some error occurred', err); // eslint-disable-line no-console
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
    if (!this.props.profile.userIsLoggedIn) {
      return (
        <div className='content-add' >
          <Login>Log ind for at skrive et indlæg</Login>
        </div>
      );
    }

    const uniqueId = `upload-media-${this.props.type}-${this.props.id || this.props.parentId}`;

    return (
      <div className='content-add' >
        <form method="POST" action={`/grupper/content/${this.props.type}`} encType="multipart/form-data"
              id="content_form_component" ref="group-post-form"
              onSubmit={this.onSubmit.bind(this)} >
          <div className='content-input-wrapper' >
            <input type="hidden" name="id" value={this.props.id || null} />
            <input type="hidden" name="imageRemoved" value={this.state.imageRemoved} />
            <input type="hidden" className="redirect" name="redirect" value={this.props.redirectTo} />
            <input type="hidden" name="parentId" value={this.props.parentId} />
            {this.state.attachment.video_file &&
            <input type="hidden" className="video_file" name="video_file" value={this.state.attachment.video_file} />}
          <textarea required="required" ref='contentTextarea' name="content"
                    placeholder='Gi den gas & hold god tone ;-)'
                    value={this.state.text}
                    onChange={(e) => this.setState({text: e.target.value})} />
            {this.state.attachment.image &&
            <div className='content-add--preview-image' >
              <img src={this.state.attachment.image} alt="preview" />
              <a href="#removeImage" className="remove-image" onClick={(e) => this.clearImage(e)} ><Icon glyph={close} /></a>
            </div>
            }

            <div className='preview-video' >
              {this.state.attachment.video &&
              <div>
                <span className="preview-video--name" >{this.state.attachment.video.file.name}</span>
                <progress max="100" value={this.state.attachment.video.file.progress || 0} />
              </div>
              }
            </div>
          </div>

          <div className='content-add--actions' >
            <input type="submit" className='button submit' value="OK" />
            <input ref="abort" type="reset" className='button alert' onClick={this.onAbort.bind(this, null)} value="Fortryd" />
            <div className='content-add--media' >
              <label htmlFor={uniqueId} >
                <input
                  id={uniqueId}
                  accept='image/*,video/*'
                  type="file"
                  className="upload-content-media droppable-media-field--file-input"
                  name="image"
                  onChange={(event) => this.readInput(event)}
                  ref="fileInput"
                />

                <Icon glyph={videoSvg} />
                <Icon glyph={cameraSvg} />
                Upload
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
  profile: React.PropTypes.object.isRequired,
  parentId: React.PropTypes.number.isRequired,
  redirectTo: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  text: React.PropTypes.string,
  image: React.PropTypes.string,
  id: React.PropTypes.number
};
