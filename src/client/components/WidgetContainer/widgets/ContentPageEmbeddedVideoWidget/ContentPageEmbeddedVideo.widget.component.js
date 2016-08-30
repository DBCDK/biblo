/**
 * @file: ContentPageEmbeddedVideoWidget embeds videos from vimeo and youtube onto content pages.
 */

import React, {Component, PropTypes} from 'react';
import Youtube from 'react-youtube';
import ExtractYoutubeID from '../../../../Utils/extractYoutubeID';
import {isEqual} from 'lodash';

import './ContentPageEmbeddedVideo.widget.component.scss';

export class ContentPageEmbeddedVideoWidget extends Component {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    let video = '';

    if (this.props.widgetConfig.type === 'YouTube') {
      const youtubeId = ExtractYoutubeID(this.props.widgetConfig.src)[0];
      video = (<Youtube videoId={youtubeId} />);
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
