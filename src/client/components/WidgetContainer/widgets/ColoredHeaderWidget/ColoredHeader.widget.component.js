/**
 * @file: ColoredHeaderWidget renders a header text with a background colour.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ColoredHeader from '../../../General/ColoredHeader/ColoredHeader.component';
import {isEqual} from 'lodash';

export class ColoredHeaderWidget extends Component {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    const {color, iconGlyph, text, title, imageSrc, backgroundColor} = this.props.widgetConfig;

    return (
      <ColoredHeader
        color={color}
        iconGlyph={iconGlyph}
        text={text}
        title={title}
        imageSrc={imageSrc}
        backgroundColor={backgroundColor}
      />
    );
  }
}

ColoredHeaderWidget.displayName = 'ColoredHeaderWidget';
ColoredHeaderWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};
