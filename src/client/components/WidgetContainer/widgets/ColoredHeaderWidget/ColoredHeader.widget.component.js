/**
 * @file: ColoredHeaderWidget renders a header text with a background colour.
 */

import React, {Component, PropTypes} from 'react';
import ColoredHeader from '../../../General/ColoredHeader/ColoredHeader.component';

export class ColoredHeaderWidget extends Component {
  render() {
    let {color, iconGlyph, text, title} = this.props.widgetConfig;

    return (
      <ColoredHeader
        color={color}
        iconGlyph={iconGlyph}
        text={text}
        title={title}
      />
    );
  }
}

ColoredHeaderWidget.displayName = 'ColoredHeaderWidget';
ColoredHeaderWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};