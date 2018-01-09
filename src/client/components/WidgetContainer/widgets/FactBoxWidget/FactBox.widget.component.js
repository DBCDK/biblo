/**
 * @file: FactBoxWidget
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';
import sanitizeHtml from './../../../../Utils/sanitizeHtml.util';

import './scss/FactBox.widget.component.scss';

export class FactBoxWidget extends AbstractWidget {
  state = {
    isClient: false
  };

  componentDidMount() {
    this.setState({isClient: true});
  }

  shouldComponentUpdate(nextProps, nextState) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig) || !isEqual(nextState.isClient, this.state.isClient);
  }

  render() {
    const factboxTitle = this.props.widgetConfig.title || '';

    const factboxContent = this.props.widgetConfig.content || '';

    const factboxTitleContainer = this.state.isClient ?
      <h3 dangerouslySetInnerHTML={{__html: sanitizeHtml(factboxTitle)}} /> :
      <h3 />;

    const factboxContentContainer = this.state.isClient ?
      <div className="fact-box--content" dangerouslySetInnerHTML={{__html: sanitizeHtml(factboxContent)}} /> :
      <div className="fact-box--content" />;

    return (
      <div className="fact-box-widget">
        {factboxTitleContainer}
        {factboxContentContainer}
      </div>
    );
  }
}

FactBoxWidget.displayName = 'FactBoxWidget';
