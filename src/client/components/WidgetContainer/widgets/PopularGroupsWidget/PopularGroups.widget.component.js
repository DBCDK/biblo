/**
 * @file: Implementation of the popular groups widget.
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';

import Icon from '../../../General/Icon/Icon.component';

import plusSvg from '../../../General/Icon/svg/functions/plus.svg';
import minusSvg from '../../../General/Icon/svg/functions/minus.svg';
import groupsSvg from '../../../General/Icon/svg/functions/group.svg';

import './scss/PopularGroups.widget.component.scss';

export class PopularGroupsWidget extends AbstractWidget {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  componentDidMount() {
    const limit = this.props.widgetConfig.groupsToLoad || 20;
    this.callServiceProvider('listGroups', {order: 'group_pop DESC', limit});
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp.
    return !isEqual(nextState, this.state) || !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp);
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
    const expanded = this.state.expanded;
    const groups = (this.props.widgetReducerProp.groups);

    return (
      <div className="popular-groups-widget">
        <div className={`popular-groups-widget--groups-container  ${!expanded && 'closed'}`}>
          {groups.map(group => this.renderGroup(group))}
        </div>

        <div className="popular-groups-widget--show-more-button--container">
          <a
            className="popular-groups-widget--show-more-button"
            onClick={() => this.setState({expanded: !this.state.expanded})}>
            <Icon glyph={this.state.expanded ? minusSvg : plusSvg}/>
            {this.state.expanded ? ' VIS FÆRRE' : ' VIS FLERE'}
          </a>
          <hr />
        </div>
      </div>
    );
  }
}

PopularGroupsWidget.displayName = 'PopularGroupsWidget';
