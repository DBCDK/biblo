import React from 'react';

/**
 * Base class for media uploads
 *
 * extend this from your component that needs to upload media files and offer the ability to cancel them
 *
 * use onAbort to cancel uploads
 */
export default class UploadMedia extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * addContent. Perform a XHR based upload  that can be aborted. use onAbort for this.
   *
   * @param form Form containing the data to be uploaded
   * @param target The REST endpoint to talk to . We expect the endpoint handles "image" and "video" so far.
   *
   * @returns {Promise}
   */
  addContent(form, target) {
    let formData = new FormData(form);
    return new Promise((resolve, reject) => {
      this.xhr = new XMLHttpRequest();
      this.xhr.open('POST', target);
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      this.xhr.onload = (event) => {
        try {
          const contentResponse = JSON.parse(event.target.response);

          if (event.target.status === 200) {
            if (contentResponse.errors && contentResponse.errors.length > 0) {
              return reject(contentResponse);
            }
            return resolve(contentResponse);
          }

          if (contentResponse.status === 500 && contentResponse.data && contentResponse.data.error) {
            return reject(contentResponse.data.error);
          }
        }
        catch (err) {
          reject(err);
        }

        return reject('Upload fejlede');
      };
      this.xhr.send(formData);
    });
  }

  /**
   *  attach a media file (currently an image or a video)
   *
   * @param event
   * @param onProgress   callback to update screen during progress
   * @returns {Promise}  returns a promise with attachment if success or a error mesage if rejected
   */
  readInput(event, onProgress) {
    return new Promise((resolve, reject) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const type = file.type.split('/')[0];

        if (type === 'image') {
          resolve(this.handleImage(file, onProgress));
        }
        else if (type === 'video') {
          resolve(this.handleVideo(file, onProgress));
        }
        else {
          reject('filtype ikke understøttet');
        }
      }
    });
  }

  /**
   * Handle image uploads
   * @param file the file to be uploaded
   * @returns {Promise}  returns a promise with attachment if success or a error mesage if rejected
   */
  handleImage(file, onProgress) {
    const errorMessage = 'Upload af billede er fejlet!';

    return new Promise((resolve, reject) => {
      file.progress = 0;

      const attachment = {image: {file: file}};
      const reader = new FileReader();
      const form = new FormData();

      reader.onload = (e) => {
        attachment.image.data = e.target.result;
        onProgress(attachment);
      };

      reader.readAsDataURL(file);
      form.append('image', file);

      this.xhr = new XMLHttpRequest();
      this.xhr.open('POST', '/api/uploadimage');
      this.xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const percentage = (e.loaded / e.total) * 100;
          attachment.image.file.progress = percentage;
          if (onProgress) {
            onProgress(attachment);
          }
        }
      };

      this.xhr.onerror = () => {
        return reject(errorMessage);
      };

      this.xhr.onload = e => {
        if (e.target.status === 200) {
          try {
            attachment.image.imageCollectionId = JSON.parse(this.xhr.responseText).id;
          }
          catch (err) {
            return reject(errorMessage);
          }

          attachment.image.progress = 100;
          attachment.image.file = null;
          return resolve(attachment);
        }

        return reject(errorMessage);
      };

      this.xhr.send(form);
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
      const attachment = {video: {file: file}};
      const form = new FormData();
      form.append('video', file);
      this.xhr = new XMLHttpRequest();
      this.xhr.open('POST', '/api/uploadvideo');
      this.xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentage = (e.loaded / e.total) * 100;
          attachment.video.file.progress = percentage;
          if (onProgress) {
            onProgress(attachment);
          }
        }
      };

      this.xhr.onerror = () => {
        return reject('upload af video fejlede - prøv igen');
      };

      this.xhr.onload = (e) => {
        if (e.target.status === 200) {
          attachment.video.file.progress = 100;
          return resolve(attachment);
        }
        return reject('Upload fejlede - prøv igen');
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
    if (this.xhr) {
      this.xhr.abort();
    }
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
