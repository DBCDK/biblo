import React from 'react';

/**
 * Base class for media uploads
 *
 * extend this from your component that needs to upload media files
 * The contribution from this is that you can abort large uploads
 *
 */
export default class UploadMedia extends React.Component {

  /**
   * addContent. Perform a XHR based upload  that can be aborted. use onAbort for this.
   *
   * @param form Form containing the data to be uploaded
   * @param target The REST endpoint to talk to . We expect the endpoint "image" and "video" so far.
   *
   * @returns {Promise}
   */
  addContent(form, target) {
    let formData = new FormData(form);
    return new Promise((resolve, reject) => {
      this.xhr = new XMLHttpRequest();
      this.xhr.open('POST', target);
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      this.xhr.send(formData);
      this.xhr.onload = (event) => {
        if (event.target.status === 200) {
          const contentResponse = JSON.parse(event.target.response);
          if (contentResponse.errors && contentResponse.errors.length > 0) {
            return reject({errorMsg: contentResponse.errors[0].errorMessage});
          }
          return resolve(contentResponse);
        }
        return reject({errorMsg: 'Upload fejlede'});
      };
    });
  }

  /**
   *  attach a media file (currently an image or a video)
   *
   * @param event
   * @param onProgress   callback to update screen during progress
   * @returns {Promise}  returns a promise with attachment state
   */
  readInput(event, onProgress) {
    return new Promise((resolve) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const type = file.type.split('/')[0];

        if (type === 'image') {
          resolve(this.handleImage(file));
        }
        else if (type === 'video') {
          resolve(this.handleVideo(file, onProgress));
        }
        else {
          resolve({errorMsg: 'filtype ikke understøttet'});
        }
      }
    });
  }

  /**
   * Handle image uploads
   * @param file the file to be uploaded
   */
  handleImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment = {image: e.target.result, video: null};
        return resolve({attachment: attachment});
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * handle video uploads to the biblo.dk server
   * @param file  File to be uploaded
   * @param onProgress  callback to report on progress
   */
  handleVideo(file, onProgress) {
    return new Promise((resolve, reject) => {
      file.progress = 0;
      const attachment = {image: null, video: {file: file}};
      const form = new FormData();
      form.append('video', file);
      this.xhr = new XMLHttpRequest();
      this.xhr.open('POST', '/api/uploadvideo');
      this.xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentage = (e.loaded / e.total) * 100;
          attachment.video.file.progress = percentage;
          if (onProgress) {
            onProgress({attachment: attachment});
          }
        }
      };

      this.xhr.onerror = () => {
        return reject({attachment: attachment});
      };

      this.xhr.onload = (e) => {
        if (e.target.status === 200) {
          attachment.video.file.progress = 100;
          return resolve({attachment: attachment});
        }
        return reject({attachment: attachment});
      };
      this.xhr.send(form);
    });
  }

  /**
   * Callback for the 'Fortryd'-button on the form
   */
  onAbort(event) {
    if (this.props.abort) {
      this.props.abort(event);
    }

    this.setState({text: '', attachment: {image: null, video: null}});
    this.xhr.abort();
  }

  /**
   * clear the image on the form
   * @param e
   */
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
}

UploadMedia.displayName = 'UploadMedia';
UploadMedia.propTypes = {
  abort: React.PropTypes.func,
  delete: React.PropTypes.func,
  addContentAction: React.PropTypes.func.isRequired,
  autofocus: React.PropTypes.bool,
  profile: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
  text: React.PropTypes.string,
  image: React.PropTypes.string,
  id: React.PropTypes.number
};
