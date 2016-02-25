'use strict';

import './addContent.scss';
import autosize from 'autosize';
import React from 'react';
import Icon from '../../General/Icon/Icon.component.js';
import cameraSvg from '../../General/Icon/svg/functions/camera.svg';

export default class AddContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      image: null
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

  render() {
    if (!this.props.profile.userIsLoggedIn) {
      return (
        <div className='content-add'>
          <a href="/login">Log ind for at skrive et indlæg</a>
        </div>
      );
    }

    const uniqueId = `upload-image-${this.props.type}-${this.props.parentId}`;

    return (
      <div className='content-add'>
        <form method="POST" action={`/grupper/content/${this.props.type}`} encType="multipart/form-data"
              id="content_form_component" ref="group-form"
              onSubmit={this.onSubmit.bind(this)}>
          <div className='content-input-wrapper'>
            <input type="hidden" className="redirect" name="redirect" value={this.props.redirectTo}/>
            <input type="hidden" className="parentid" name="parentId" value={this.props.parentId}/>
          <textarea required="required" ref='contentTextarea' name="content" placeholder='Gi den gas & hold god tone ;-)'
                    value={this.state.text}
                    onChange={(e) => this.setState({text: e.target.value})}/>

            <div className='preview-image'>
              {this.state.image && <img src={this.state.image} alt="preview"/>}
            </div>
          </div>

          <div className='content-add--actions'>
            <input type="submit" className='button submit' value="OK" />
            {
              this.props.abort &&
              <input ref="about" type="button" className='button alert' onClick={(e) => this.props.abort(e)} value="Fortryd" />
            }
            <div className='content-add--image'>
              <label htmlFor={uniqueId}>
                <input id={uniqueId} accept='image/*' type="file"
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
  abort: React.PropTypes.func
};
