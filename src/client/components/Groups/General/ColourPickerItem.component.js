import React from 'react';

export function ColourPickerItem({colourName, disabled, inputName, onChangeFunction}) {
  return (
    <span className="colour-picker--item" >
        <input
          name={inputName}
          className={'colour-picker--colour ' + colourName}
          disabled={disabled}
          type='radio'
          id={'colour-picker--colour-' + colourName}
          onChange={onChangeFunction}
          value={colourName}
          required
        />
        <label
          className={'colour-picker--label ' + colourName}
          htmlFor={'colour-picker--colour-' + colourName} >
          <div className={'colour-box ' + colourName} ></div>
        </label>
      </span>
  );
}

ColourPickerItem.displayName = 'ColourPickerItem';
ColourPickerItem.propTypes = {
  colourName: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  inputName: React.PropTypes.string.isRequired,
  onChangeFunction: React.PropTypes.func.isRequired
};
