'use strict';

import React from 'react';

export default class ColourPickerItem extends React.Component {
  render() {
    return (
      <span className="colour-picker--item">
        <input
          name={this.props.inputName}
          className={'colour-picker--colour ' + this.props.colourName}
          type='radio'
          id={'colour-picker--colour-' + this.props.colourName}
          onChange={this.props.onChangeFunction}
          value={this.props.colourName}
          required
        />
        <label
          className={'colour-picker--label ' + this.props.colourName}
          htmlFor={'colour-picker--colour-' + this.props.colourName} >
          <div className={'colour-box ' + this.props.colourName}></div>
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
