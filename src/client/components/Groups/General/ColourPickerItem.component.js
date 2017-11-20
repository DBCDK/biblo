import React from 'react';
import PropTypes from 'prop-types';

export function ColourPickerItem({colourName, disabled, inputName, onChangeFunction}) {
  return (
    <span className="colour-picker--item">
      <input
        name={inputName}
        className={'colour-picker--colour ' + colourName}
        disabled={disabled}
        type="radio"
        id={'colour-picker--colour-' + colourName}
        onChange={onChangeFunction}
        value={colourName}
        required
      />
      <label className={'colour-picker--label ' + colourName} htmlFor={'colour-picker--colour-' + colourName}>
        <div className={'colour-box ' + colourName} />
      </label>
    </span>
  );
}

ColourPickerItem.displayName = 'ColourPickerItem';
ColourPickerItem.propTypes = {
  colourName: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  inputName: PropTypes.string.isRequired,
  onChangeFunction: PropTypes.func.isRequired
};
