'use strict';

import React from 'react';
import Modernizr from 'modernizr';

import './_droppableimagefield.component.scss';

export default class DroppableImageField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgSrc: props.imageSrc
    };

    this.readFiles.bind(this);
  }

  componentDidMount() {
    let self = this;
    if (Modernizr.draganddrop) {
      let dropSpot = document.getElementById('droppableImageField');
      let hoverMessage = document.getElementById('drop-files-here-message');

      dropSpot.ondragover = () => {
        hoverMessage.className = 'hover';
        return false;
      };

      dropSpot.ondragend = () => {
        hoverMessage.className = '';
        return false;
      };

      dropSpot.ondrop = (e) => {
        hoverMessage.className = '';
        e.preventDefault();
        if (e.dataTransfer.files[0].type.indexOf('image/') >= 0) {
          document.getElementById('wrong-filetype-message').className = '';
          self.readFiles(e.dataTransfer.files);
        }
        else {
          document.getElementById('wrong-filetype-message').className = 'wrong-file';
        }
      };
    }

    this.refs.droppableimagefieldinput.onchange = (e) => {
      this.readFiles(e.srcElement.files);
    };
  }

  readFiles(files) {
    if (files && files[0]) {
      const file = files[0];

      if ('FileReader' in window) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.setState({
            imgSrc: e.target.result
          });
        };

        reader.readAsDataURL(file);
      }
      else {
        document.getElementById('filereader-fallback-message').className = 'uploaded';
      }

      this.props.onFile(file);
    }
  }

  render() {
    return (
      <div className="droppable-image-field" id="droppableImageField">
        <label>
          <div className="image-and-plus-button-container">
            <img src={this.state.imgSrc} />
            <div className="upload-plus-button"> </div>
          </div>
          <input accept='image/*' type="file" className="droppable-image-field--file-input" name="droppableimagefield" ref="droppableimagefieldinput" />
        </label>
        <p id='drop-files-here-message'>Smid din fil her.</p>
        <p id='filereader-fallback-message'>Din file vil blive oploadet når du trykker OK.</p>
        <p id='wrong-filetype-message'>Du kan kun uploade billeder i dette felt, prøv med en anden fil!</p>
      </div>
    );
  }
}

DroppableImageField.displayName = 'DroppableImageField';
DroppableImageField.propTypes = {
  imageSrc: React.PropTypes.string,
  onFile: React.PropTypes.func.isRequired
};
DroppableImageField.defaultProps = {
  imageSrc: 'http://orig07.deviantart.net/a9e4/f/2014/228/c/d/minecraft_skins__1___notch_by_kienbennett-d7vdvy3.jpg'
};
