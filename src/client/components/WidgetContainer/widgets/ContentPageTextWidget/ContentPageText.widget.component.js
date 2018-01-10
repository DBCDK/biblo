/**
 * @file: This file contains a widget for rendering text fields from biblo admin.
 */

/* eslint-disable react/no-danger */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
import sanitizeHtml from './../../../../Utils/sanitizeHtml.util';

export class ContentPageTextWidget extends Component {
  state = {
    isClient: false
  };

  componentDidMount() {
    this.setState({isClient: true});
  }

  shouldComponentUpdate(nextProps, nextState) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig) || nextState.isClient !== this.state.isClient;
  }

  render() {
    const content = this.state.isClient ?
      <span className="content-page--text-widget" dangerouslySetInnerHTML={{__html: sanitizeHtml(this.props.widgetConfig.content)}} /> :
      <span className="content-page--text-widget" />;
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

ContentPageTextWidget.displayName = 'ContentPageTextWidget';
ContentPageTextWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};
