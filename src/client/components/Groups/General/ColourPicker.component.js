import React from 'react';

import {ColourPickerItem} from './ColourPickerItem.component';

import './_colourpicker.component.scss';

const ColourPicker = ({baseName, colours, disabled, onChangeFunction, wrapInForm}) => {
  const inputName = baseName + '_colour';
  const colourPickerItems = colours.map((colour) => {
    return (
      <ColourPickerItem
        colourName={colour}
        disabled={disabled}
        inputName={inputName}
        key={'colour-picker-item-' + colour}
        onChangeFunction={onChangeFunction} />
    );
  });

  const content = (
    <div className="colour-picker">
      {colourPickerItems}
    </div>
  );

  if (wrapInForm) {
    return (
      <form>
        {content}
      </form>
    );
  }

  return content;
};

ColourPicker.displayName = 'ColourPicker';

ColourPicker.propTypes = {
  baseName: React.PropTypes.string,
  colours: React.PropTypes.array,
  disabled: React.PropTypes.bool,
  onChangeFunction: React.PropTypes.func,
  wrapInForm: React.PropTypes.bool
};

ColourPicker.defaultProps = {
  baseName: 'ColourPicker',
  colours: ['blueish-green', 'blue', 'red', 'light-purple', 'light-blue', 'yellow'],
  disabled: false,
  onChangeFunction: () => {},
  wrapInForm: false
};

export default ColourPicker;
