'use strict';

import React from 'react';

import './_droppableimagefield.component.scss';

export default class DroppableImageField extends React.Component {
  render() {
    return (
      <div className="droppable-image-field">
        <label>
          <img src="http://d2v8ggac1o0f6z.cloudfront.net/gsc/FNLF9T/d6/0a/ca/d60aca6520e3441b92a2f60ccea71f9d/images/ny_gruppe/u217.png?token=d3c1d4a1c7063e103f2cc1803b60a533"/>
          <div className="upload-plus-button"> </div>
          <input type="file" className="droppable-image-field--file-input" />
        </label>
      </div>
    );
  }
}

DroppableImageField.displayName = 'DroppableImageField';
