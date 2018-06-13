/**
 * @file: BestRatedWorksWidget, used to display a list of the best works.
 */

import React from 'react';
import { AbstractWidget } from '../../AbstractWidget.component';
import { isEqual } from 'lodash';
import { CompactWorkElement } from './compactWorkElement.component';
import { CompactWorkElementsContainer } from './compactWorkElementsContainer.component';

import './scss/BestRatedWorks.widget.component.scss';

export class BestRatedWorksWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.getNextPage = this.getNextPage.bind(this);
    this.state = {
      closed: true,
      identifier: Array.isArray(props.widgetConfig.pids) ? props.widgetConfig.pids.join() : null,
      works: Object.values(props.widgetReducerProp.works),
      isLoading: true
    };
  }

  componentWillMount() {
    this.getNextPage(0);
  }

  componentWillReceiveProps(nextProps) {
    const works = nextProps.widgetReducerProp.works[this.state.identifier] ?
      Object.values(nextProps.widgetReducerProp.works[this.state.identifier]) :
      [];
    this.setState({ works, isLoading: false });


  }

  getNextPage(page) {
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
      worktypes,
      offset: page
    });

  }

  shouldComponentUpdate(nextProps, nextState) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp.
    return !isEqual(nextState, this.state) || !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp);
  }

  render() {
    const containerId = `best-rated-works--${this.props.widgetIndex}`;
    const config = this.props.widgetConfig;
    const size = config.size;
    const works = (this.props.widgetReducerProp.works || []).slice(0, this.state.closed ?
      6 :
      (this.state.works.length));
    const morePages = this.props.widgetReducerProp.more ? 0 : works.length;

    return (
      <div className="best-rated-works--widget" id={containerId}>
        <CompactWorkElementsContainer
          closed={this.state.closed}
          isLoading={this.state.isLoading}
          works={works} />
      </div>
    );
  }
}

BestRatedWorksWidget.displayName = 'BestRatedWorksWidget';
