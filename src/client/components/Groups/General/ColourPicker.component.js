'use strict';

import React from 'react';

import 'normalize.css';
import './_colourpicker.component.scss';

class ColourPickerItem extends React.Component {
  render() {
    return (
      <span className="colour-picker--item">
        <input
          name={this.props.inputName}
          className={"colour-picker--colour " + this.props.colourName}
          type="radio"
          id={"colour-picker--colour-" + this.props.colourName}
          onChange={this.props.onChangeFunction}
          value={this.props.colourName}
          required
        />
        <label
          className={"colour-picker--label " + this.props.colourName}
          htmlFor={"colour-picker--colour-" + this.props.colourName} >
          <div className={"colour-box " + this.props.colourName}></div>
        </label>
      </span>
    );
  }
}

ColourPickerItem.displayName = 'ColourPickerItem';
ColourPickerItem.propTypes = {
  inputName: React.PropTypes.string.isRequired,
  colourName: React.PropTypes.string.isRequired,
  onChangeFunction: React.PropTypes.func.isRequired
};

export default class ColourPicker extends React.Component {
  render() {
    const inputName = this.props.baseName + '_colour';
    const colourPickerItems = ['blueish-green', 'blue', 'green', 'bordeaux', 'red', 'salmon', 'yellow'].map((colour) => {
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