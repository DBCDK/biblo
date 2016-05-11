import autosize from 'autosize';
import React from 'react';
import Classnames from 'classnames';
import isSiteOpen from '../../../Utils/openingHours.js';

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

import {addContent, readInput} from '../../../Utils/uploadmedia.js';

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
      isLoading: false,
      disableInput: false
    };

    if (!isSiteOpen() && !this.props.profile.isModerator) {
      this.state.errorMsg = ['Du kan kun skrive mellem 09:00 og 21:00'];
      this.state.disableInput = true;
    }
  }

  componentDidMount() {
    autosize(this.refs.contentTextarea);
    if (this.refs.contentTextarea && this.props.autofocus) {
      this.refs.contentTextarea.focus();
    }
  }

  onSubmit(e) {
    if (!isSiteOpen() && !this.props.profile.isModerator) {
      e.preventDefault();
      this.setState({errorMsg: 'Du kan kun skrive mellem 09:00 og 21:00'});
    }
    else if (!this.state.text.length && !this.state.attachment.image && !this.state.attachment.video) {
      e.preventDefault();
      this.setState({errorMsg: 'Dit indlæg må ikke være tomt.'});
    }
    else {
      this.setState({isLoading: true});
      e.preventDefault();
      let form = this.refs['group-post-form'];
      addContent(form,
                 this.state.target
                ).then((contentResponse) => {
                  this.props.addContentAction(contentResponse);
                });
    }
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
                    disabled={this.state.disableInput}
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
              disabled={
                this.state.attachment.video &&
                this.state.attachment.video.file.progress > 0 &&
                this.state.attachment.video.file.progress < 100 ||
                this.state.isLoading ||
                this.state.disableInput
                }
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
                  disabled={this.state.disableInput}
                  onChange={(event) => readInput(event).then((state) => {
                    this.setState(state);
                  })}
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
  delete: React.PropTypes.func,
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
