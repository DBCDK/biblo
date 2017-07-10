/**
 * @file: This file contains a widget for rendering text fields from biblo admin.
 */

/* eslint-disable react/no-danger */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';

export class ContentPageTextWidget extends Component {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    return (
      <span className="content-page--text-widget" dangerouslySetInnerHTML={{__html: this.props.widgetConfig.content}} />
    );
  }
}

ContentPageTextWidget.displayName = 'ContentPageTextWidget';
ContentPageTextWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};
