/**
 * @file: BestRatedWorksWidget, used to display a list of the best works.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';

import {PaginationContainer} from '../../PaginationContainer.component';
import {CompactWorkElement} from './compactWorkElement.component';

import './scss/BestRatedWorks.widget.component.scss';

export class BestRatedWorksWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.getNextPage = this.getNextPage.bind(this);
  }

  componentWillMount() {
    this.getNextPage(0);
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
    const config = this.props.widgetConfig;
    const size = config.size;
    const works = (this.props.widgetReducerProp.works || [])
      .map(work => <CompactWorkElement work={work} key={`work-${work.collection[0]}`}/>);
    const morePages = this.props.widgetReducerProp.more ? 0 : works.length;

    return (
      <div className="best-rated-works--widget">
        <PaginationContainer
          nextPageFunction={this.getNextPage}
          pages={works}
          pageIncrements={size}
          genericLoading={true}
          lastPageIndex={morePages}
        />
      </div>
    );
  }
}

BestRatedWorksWidget.displayName = 'BestRatedWorksWidget';
