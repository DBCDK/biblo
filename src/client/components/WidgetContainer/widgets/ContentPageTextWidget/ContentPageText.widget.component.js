/**
 * @file: This file contains a widget for rendering text fields from biblo admin.
 */

/* eslint-disable-file react/no-danger */

import React, {Component, PropTypes} from 'react';

export class ContentPageTextWidget extends Component {
  render() {
    return (
      <span className="content-page--text-widget" dangerouslySetInnerHTML={{__html: this.props.widgetData.content}} />
    );
  }
}

ContentPageTextWidget.displayName = 'ContentPageTextWidget';
ContentPageTextWidget.propTypes = {
  widgetData: PropTypes.object.isRequired
};
