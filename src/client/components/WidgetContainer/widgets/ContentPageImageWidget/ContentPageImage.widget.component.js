/**
 * @file: ContentPageImageWidget, made to render images on content pages.
 */

import React, {Component, PropTypes} from 'react';
import {isEqual} from 'lodash';

export class ContentPageImageWidget extends Component {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    const widgetConfig = this.props.widgetConfig;

    return (
      <span className="content-page--image-widget">
        <img src={widgetConfig.src || widgetConfig.large} alt={widgetConfig.alt} title={widgetConfig.title} />
      </span>
    );
  }
}

ContentPageImageWidget.displayName = 'ContentPageImageWidget';
ContentPageImageWidget.propTypes = {
  widgetActions: PropTypes.object.isRequired,
  widgetConfig: PropTypes.object.isRequired,
  widgetLocationName: PropTypes.string.isRequired,
  widgetState: PropTypes.object.isRequired
};
