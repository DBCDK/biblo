/**
 * @file: FactBoxWidget
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';

import './scss/FactBox.widget.component.scss';

export class FactBoxWidget extends AbstractWidget {
  render() {
    const factboxTitle = this.props.widgetConfig.title || '';
    const factboxContent = this.props.widgetConfig.content || '';

    return (
      <div className="fact-box-widget">
        <p className="fact-box--title">
          <strong dangerouslySetInnerHTML={{__html: factboxTitle}} />
        </p>
        <div className="fact-box--content" dangerouslySetInnerHTML={{__html: factboxContent}} />
      </div>
    );
  }
}

FactBoxWidget.displayName = 'FactBoxWidget';
