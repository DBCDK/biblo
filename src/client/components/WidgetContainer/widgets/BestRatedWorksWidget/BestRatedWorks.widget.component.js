/**
 * @file: BestRatedWorksWidget, used to display a list of the best works.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';

import {CompactWorkElementsContainer} from './compactWorkElementsContainer.component';
import Icon from '../../../General/Icon/Icon.component';

import plusSvg from '../../../General/Icon/svg/functions/plus.svg';
import minusSvg from '../../../General/Icon/svg/functions/minus.svg';

import './scss/BestRatedWorks.widget.component.scss';

export class BestRatedWorksWidget extends AbstractWidget {
  constructor(props) {
    super(props);

    this.state = {
      closed: true
    };
  }

  componentWillMount() {
    const config = this.props.widgetConfig;
    const size = config.size;
    const age = config.age;
    const ratingParameter = config.ratingParameter;
    const countsParameter = config.countsParameter;
    const worktypes = config.worktypes;

    this.callServiceProvider('getTopReviews', {
      size,
      age,
      ratingParameter,
      countsParameter,
      worktypes
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp.
    return !isEqual(nextState, this.state) || !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp);
  }

  render() {
    let closeButtonContent;

    if (this.state.closed) {
      closeButtonContent = (
        <span>
          <Icon glyph={plusSvg}/> VIS FLERE
        </span>
      );
    }
    else {
      closeButtonContent = (
        <span>
          <Icon glyph={minusSvg}/> VIS FÆRRE
        </span>
      );
    }

    const works = (this.props.widgetReducerProp.works || []).slice(0, this.state.closed ? 6 : this.props.widgetConfig.size);

    return (
      <div className="best-rated-works--widget">
        <CompactWorkElementsContainer
          closed={this.state.closed}
          isLoading={this.props.widgetReducerProp.isLoading}
          works={works} />

        <div className="best-rated-works--widget--show-more-button--container">
          <a className="best-rated-works--widget--show-more-button" onClick={() => this.setState({closed: !this.state.closed})}>
            {closeButtonContent}
          </a>
          <hr />
        </div>
      </div>
    );
  }
}

BestRatedWorksWidget.displayName = 'BestRatedWorksWidget';
