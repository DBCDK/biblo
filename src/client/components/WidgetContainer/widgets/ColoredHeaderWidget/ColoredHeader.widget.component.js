/**
 * @file: ColoredHeaderWidget renders a header text with a background colour.
 */

import React, {Component, PropTypes} from 'react';
import ColoredHeader from '../../../General/ColoredHeader/ColoredHeader.component';
import {isEqual} from 'lodash';

export class ColoredHeaderWidget extends Component {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    const {color, iconGlyph, text, title, imageSrc, backgroundColor, backgroundImageUrl} = this.props.widgetConfig;

    return (
      <ColoredHeader
        color={color}
        iconGlyph={iconGlyph}
        text={text}
        title={title}
        imageSrc={imageSrc}
        backgroundColor={backgroundColor}
        backgroundImageUrl={backgroundImageUrl}
      />
    );
  }
}

ColoredHeaderWidget.displayName = 'ColoredHeaderWidget';
ColoredHeaderWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};
