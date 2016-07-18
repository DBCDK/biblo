/**
 * @file: BestRatedWorksWidget, used to display a list of the best works.
 */

import React, {Component, PropTypes} from 'react';
import {CompactWorkElementsContainer} from './compactWorkElementsContainer.component';

export class BestRatedWorksWidget extends Component {
  constructor() {
    super();

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

    this.props.widgetActions.callServiceProvider('getTopReviews', {
      size,
      age,
      ratingParameter,
      countsParameter,
      worktypes
    });
  }

  render() {
    const title = this.props.widgetConfig.title || '';

    return (
      <div className="best-rated-works--widget">
        <CompactWorkElementsContainer
          closed={this.state.closed}
          isLoading={this.props.widgetReducerProp.isLoading}
          works={this.props.widgetReducerProp.works} />
        <a onClick={() => this.setState({closed: !this.state.closed})}>
          {this.state.closed ? '+ Vis flere' : '- Vis færre'}
        </a>
      </div>
    );
  }
}

BestRatedWorksWidget.displayName = 'BestRatedWorksWidget';
BestRatedWorksWidget.propTypes = {
  widgetActions: PropTypes.object.isRequired,
  widgetConfig: PropTypes.object.isRequired,
  widgetReducerProp: PropTypes.object.isRequired,
  widgetState: PropTypes.object.isRequired
};
