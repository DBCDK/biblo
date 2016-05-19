/**
 * @file: ContentPageImageWidget, made to render images on content pages.
 */

import React, {Component, PropTypes} from 'react';

export class ContentPageImageWidget extends Component {
  render() {
    const widgetData = this.props.widgetData;

    return (
      <span className="content-page--image-widget">
        <img src={widgetData.src} alt={widgetData.alt} title={widgetData.title} />
      </span>
    );
  }
}

ContentPageImageWidget.displayName = 'ContentPageImageWidget';
ContentPageImageWidget.propTypes = {
  widgetActions: PropTypes.object.isRequired,
  widgetData: PropTypes.object.isRequired,
  widgetLocationName: PropTypes.string.isRequired,
  widgetState: PropTypes.object.isRequired
};
