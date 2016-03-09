'use strict';

import './addContent.scss';
import autosize from 'autosize';
import React from 'react';
import Login from '../../General/Login/Login.component';
import Icon from '../../General/Icon/Icon.component';
import cameraSvg from '../../General/Icon/svg/functions/camera.svg';
import close from '../../General/Icon/svg/functions/close.svg';

export default
class AddContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: props.text || '',
      image: props.image || null,
      imageRemoved: false
    };
  }

  componentDidMount() {
    autosize(this.refs.postTextarea);
  }

  onSubmit(e) {
    if (!this.state.text.length) {
      e.preventDefault();
      alert('Dit indlæg skal indeholde text'); // eslint-disable-line no-alert
    }
  }

  readURL(input) {
    if (input.target.files && input.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.setState({image: e.target.result});
      };

      reader.readAsDataURL(input.target.files[0]);
    }
  }

  clearImage(e) {
    e.preventDefault();
    if (this.refs.fileInput.value) {
      this.refs.fileInput.value = null;
      this.setState({image: null});
    }
    else {
      this.setState({image: null, imageRemoved: true});
    }

  }

  render() {
    if (!this.props.profile.userIsLoggedIn) {
      return (
        <div className='content-add'>
          <Login>Log ind for at skrive et indlæg</Login>
        </div>
      );
    }

    const uniqueId = `upload-image-${this.props.type}-${this.props.id || this.props.parentId}`;

    return (
      <div className='content-add'>
        <form method="POST" action={`/grupper/content/${this.props.type}`} encType="multipart/form-data"
              id="content_form_component" ref="group-form"
              onSubmit={this.onSubmit.bind(this)}>
          <div className='content-input-wrapper'>
            <input type="hidden" name="id" value={this.props.id || null}/>
            <input type="hidden" name="imageRemoved" value={this.state.imageRemoved}/>
            <input type="hidden" className="redirect" name="redirect" value={this.props.redirectTo}/>
            <input type="hidden" name="parentId" value={this.props.parentId}/>
          <textarea required="required" ref='contentTextarea' name="content"
                    placeholder='Gi den gas & hold god tone ;-)'
                    value={this.state.text}
                    onChange={(e) => this.setState({text: e.target.value})}/>
            {this.state.image &&
            <div className='content-add--preview-image'>
              <img src={this.state.image} alt="preview"/>
              <a href="#removeImage" className="remove-image" onClick={(e) => this.clearImage(e)}><Icon glyph={close}/></a>
            </div>}
          </div>

          <div className='content-add--actions'>
            <input type="submit" className='button submit' value="OK"/>
            {
              this.props.abort &&
              <input ref="about" type="button" className='button alert' onClick={(e) => this.props.abort(e)}
                     value="Fortryd"/>
            }
            <div className='content-add--image'>
              <label htmlFor={uniqueId}>
                <input ref="fileInput" id={uniqueId} accept='image/*' type="file"
                       className="upload-content-image droppable-image-field--file-input" name="image"
                       onChange={(event) => this.readURL(event)}
                  />
                <Icon glyph={cameraSvg}/>Upload</label>
            </div>
          </div>
        </form>
      </div>);
  }
}

AddContent.propTypes = {
  profile: React.PropTypes.object.isRequired,
  parentId: React.PropTypes.number.isRequired,
  type: React.PropTypes.string.isRequired,
  redirectTo: React.PropTypes.string.isRequired,
  abort: React.PropTypes.func,
  text: React.PropTypes.string,
  image: React.PropTypes.string,
  id: React.PropTypes.number
};
