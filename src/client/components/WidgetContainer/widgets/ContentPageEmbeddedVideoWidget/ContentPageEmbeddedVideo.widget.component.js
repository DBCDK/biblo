/**
 * @file: ContentPageEmbeddedVideoWidget embeds videos from vimeo and youtube onto content pages.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {parseStringForVideoUrls} from '../../../../Utils/parseStringForVideoUrls';
import {isEqual} from 'lodash';

import './ContentPageEmbeddedVideo.widget.component.scss';

export class ContentPageEmbeddedVideoWidget extends Component {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    let video = '';

    if (this.props.widgetConfig.type === 'YouTube' || this.props.widgetConfig.type === 'Vimeo') {
      video = parseStringForVideoUrls(this.props.widgetConfig.src, true);
    }
    else {
      console.warn('Did not find a video with type YouTube or Vimeo. Embedded video wont be rendered.'); // eslint-disable-line
    }

    return (
      <span className="content-page--embedded-video">
        {video}
      </span>
    );
  }
}

ContentPageEmbeddedVideoWidget.displayName = 'ContentPageEmbeddedVideoWidget';
ContentPageEmbeddedVideoWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};
