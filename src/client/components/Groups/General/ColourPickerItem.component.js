'use strict';

import React from 'react';

const ColourPickerItem = ({colourName, inputName, onChangeFunction}) => {
  return (
    <span className="colour-picker--item">
        <input
          name={inputName}
          className={'colour-picker--colour ' + colourName}
          type='radio'
          id={'colour-picker--colour-' + colourName}
          onChange={onChangeFunction}
          value={colourName}
          required
        />
        <label
          className={'colour-picker--label ' + colourName}
          htmlFor={'colour-picker--colour-' + colourName} >
          <div className={'colour-box ' + colourName}></div>
        </label>
      </span>
  );
};

ColourPickerItem.displayName = 'ColourPickerItem';
ColourPickerItem.propTypes = {
  colourName: React.PropTypes.string.isRequired,
  inputName: React.PropTypes.string.isRequired,
  onChangeFunction: React.PropTypes.func.isRequired
};

export default ColourPickerItem;
