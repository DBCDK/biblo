import React from 'react';
import PropTypes from 'prop-types';

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
  baseName: PropTypes.string,
  colours: PropTypes.array,
  disabled: PropTypes.bool,
  onChangeFunction: PropTypes.func,
  wrapInForm: PropTypes.bool
};

ColourPicker.defaultProps = {
  baseName: 'ColourPicker',
  colours: ['blueish-green', 'blue', 'red', 'light-purple', 'light-blue', 'yellow'],
  disabled: false,
  onChangeFunction: () => {},
  wrapInForm: false
};

export default ColourPicker;
