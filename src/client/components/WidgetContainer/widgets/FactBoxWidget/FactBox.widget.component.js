/**
 * @file: FactBoxWidget
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';

import './scss/FactBox.widget.component.scss';

export class FactBoxWidget extends AbstractWidget {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    const factboxTitle = this.props.widgetConfig.title || '';
    const factboxContent = this.props.widgetConfig.content || '';

    return (
      <div className="fact-box-widget">
        <h3 dangerouslySetInnerHTML={{__html: factboxTitle}}/>
        <div className="fact-box--content" dangerouslySetInnerHTML={{__html: factboxContent}}/>
      </div>
    );
  }
}

FactBoxWidget.displayName = 'FactBoxWidget';
