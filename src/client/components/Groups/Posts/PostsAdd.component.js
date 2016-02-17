'use strict';

import './scss/post-add.scss';
import autosize from 'autosize';
import React from 'react';
import Icon from '../../General/Icon/Icon.component.js';
import cameraSvg from '../../General/Icon/svg/functions/camera.svg';

export default class PostAdd extends React.Component {

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
    if (this.props.profile.role === 0) {
      return (
        <div className='post-add' >
          <a href="/login" >Log ind for at skrive et indlæg</a>
        </div>
      );
    }
    return (
      <div className='post-add' >
        <form method="POST" action="/grupper/post" encType="multipart/form-data" id="post_form_component" ref="group-form"
              onSubmit={this.onSubmit.bind(this)} >
          <div className='post-input-wrapper' >
            <input type="hidden" name="method" value="post" />
            <input type="hidden" name="groupId" value={this.props.groupId} />
          <textarea ref='postTextarea' name="content" placeholder='Gi den gas & hold god tone ;-)'
                    value={this.state.text}
                    onChange={(e) => this.setState({text: e.target.value})} ></textarea>

            <div className='preview-image' >
              {this.state.image && <img src={this.state.image} alt="preview" />}
            </div>
          </div>

          <div className='post-add--actions' >
            <button className='button' >OK</button>
            <div className='post-add--image' >
              <label htmlFor="upload-post-image" >
                <input id="upload-post-image" accept='image/*' type="file"
                       className="droppable-image-field--file-input" name="image"
                       ref="image-input" onChange={this.readURL.bind(this)}
                  />
                <Icon glyph={cameraSvg} />Tilføj billede eller video</label>
            </div>
          </div>
        </form>
      </div>);
  }
}

PostAdd.propTypes = {
  profile: React.PropTypes.object,
  groupId: React.PropTypes.number
};
