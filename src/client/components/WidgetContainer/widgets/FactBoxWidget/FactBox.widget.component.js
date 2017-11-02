/**
 * @file: FactBoxWidget
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';
import DOMPurify from 'dompurify';

import './scss/FactBox.widget.component.scss';

export class FactBoxWidget extends AbstractWidget {
  shouldComponentUpdate(nextProps) {
    // We only care about the widgetConfig
    return !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  render() {
    const factboxTitle = this.props.widgetConfig.title || '';
    const factboxTitleSanitized = typeof window !== 'undefined' ? DOMPurify.sanitize(factboxTitle) : '';

    const factboxContent = this.props.widgetConfig.content || '';
    const factboxContentSanitized = typeof window !== 'undefined' ? DOMPurify.sanitize(factboxContent) : '';

    return (
      <div className="fact-box-widget">
        <h3 dangerouslySetInnerHTML={{__html: factboxTitleSanitized}} />
        <div className="fact-box--content" dangerouslySetInnerHTML={{__html: factboxContentSanitized}} />
      </div>
    );
  }
}

FactBoxWidget.displayName = 'FactBoxWidget';
