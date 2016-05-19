/**
 * @file: ContentPageEmbeddedVideoWidget embeds videos from vimeo and youtube onto content pages.
 */

import React, {Component, PropTypes} from 'react';
import Youtube from 'react-youtube';
import ExtractYoutubeID from '../../../../Utils/extractYoutubeID';

export class ContentPageEmbeddedVideoWidget extends Component {
  render() {
    let video = '';

    if (this.props.widgetData.type === 'YouTube') {
      const youtubeId = ExtractYoutubeID(this.props.widgetData.src)[0];
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
  widgetData: PropTypes.object.isRequired
};
