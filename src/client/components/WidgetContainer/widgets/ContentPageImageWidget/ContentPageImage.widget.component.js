/**
 * @file: ContentPageImageWidget, made to render images on content pages.
 */

import React, {Component, PropTypes} from 'react';

export class ContentPageImageWidget extends Component {
  render() {
    const widgetConfig = this.props.widgetConfig;

    return (
      <span className="content-page--image-widget">
        <img src={widgetConfig.src} alt={widgetConfig.alt} title={widgetConfig.title} />
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
