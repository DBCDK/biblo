/**
 * @file: Implementation of the popular groups widget.
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';

import Icon from '../../../General/Icon/Icon.component';
import {PaginationContainer} from '../../PaginationContainer.component';

import groupsSvg from '../../../General/Icon/svg/functions/group.svg';

import './scss/PopularGroups.widget.component.scss';

export class PopularGroupsWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.getNextPage = this.getNextPage.bind(this);
  }

  componentDidMount() {
    this.getNextPage(0);
  }

  shouldComponentUpdate(nextProps) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp.
    return !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp);
  }

  getNextPage(page) {
    const limit = this.props.widgetConfig.groupsToLoad || 20;
    this.callServiceProvider('listGroups', {skip: limit * page, order: 'group_pop DESC', limit});
  }

  renderGroup(group) {
    return (
      <a
        key={`group_${group.id}`}
        className="popular-groups-widget--group-container"
        href={`/grupper/${group.id}`}
      >
        <div className="popular-groups-widget--group-image-container">
          <img src={group.imageSquare} />
        </div>

        <div className="popular-groups-widget--group-name-container">
          <Icon glyph={groupsSvg} /> <span dangerouslySetInnerHTML={{__html: group.name}} />
        </div>
      </a>
    );
  }

  render() {
    const htmlId = `popular-groups-${this.props.widgetIndex}`;
    const limit = this.props.widgetConfig.groupsToLoad || 20;
    const groups = (this.props.widgetReducerProp.groups || []).map(group => this.renderGroup(group));

    return (
      <div className="popular-groups-widget" id={htmlId}>
        <PaginationContainer
          anchor={htmlId}
          nextPageFunction={this.getNextPage}
          pages={groups}
          pageIncrements={limit}
        />
      </div>
    );
  }
}

PopularGroupsWidget.displayName = 'PopularGroupsWidget';
