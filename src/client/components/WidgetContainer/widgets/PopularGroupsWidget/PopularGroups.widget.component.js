/**
 * @file: Implementation of the popular groups widget.
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';
import DOMPurify from 'dompurify';

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
    this.getNextPage(this.props.widgetConfig.groupsToLoad);
  }

  shouldComponentUpdate(nextProps) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp.
    return !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp);
  }

  getNextPage(page) {
    const limit = this.props.widgetConfig.groupsToLoad || 20;
    this.callServiceProvider('popularGroups', {skip: page - this.props.widgetConfig.groupsToLoad, limit});
  }

  renderGroup(group) {
    const groupName = typeof window !== 'undefined' ? DOMPurify.sanitize(group.name) : '';

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
          <Icon glyph={groupsSvg} /> <span dangerouslySetInnerHTML={{__html: groupName}} />
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
          lastPageIndex={this.props.widgetReducerProp.count}
        />
      </div>
    );
  }
}

PopularGroupsWidget.displayName = 'PopularGroupsWidget';
