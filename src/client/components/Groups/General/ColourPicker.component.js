'use strict';

import React from 'react';

import ColourPickerItem from './ColourPickerItem.component';

import 'normalize.css';
import './_colourpicker.component.scss';

export default class ColourPicker extends React.Component {
  render() {
    const inputName = this.props.baseName + '_colour';
    const colourPickerItems = ['blueish-green', 'blue', 'red', 'light-purple', 'light-blue', 'yellow'].map((colour) => {
      return (
        <ColourPickerItem
          colourName={colour}
          inputName={inputName}
          key={'colour-picker-item-' + colour}
          onChangeFunction={this.props.onChangeFunction} />
      );
    });

    const content = (
      <div className="colour-picker">
        {colourPickerItems}
      </div>
    );

    if (this.props.wrapInForm) {
      return (
        <form>
          {content}
        </form>
      );
    }

    return content;
  }
}

ColourPicker.displayName = 'ColourPicker';

ColourPicker.propTypes = {
  baseName: React.PropTypes.string.isRequired,
  wrapInForm: React.PropTypes.bool,
  onChangeFunction: React.PropTypes.func.isRequired
};

ColourPicker.defaultProps = {
  baseName: 'colourPicker',
  wrapInForm: true
};
