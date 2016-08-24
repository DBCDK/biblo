/* eslint-disable react/no-danger */

import React from 'react';

import './scss/group-tile.scss';

import Icon from '../../General/Icon/Icon.component.js';
import groupSvg from '../../General/Icon/svg/functions/group.svg';

export default class GroupViewTile extends React.Component {

  getCoverImageUrl(group) {
    return (group.imageSquare ? group.imageSquare : '/no_group_image.png');
  }

  getMembersCountString() {
    let groupStr,
      group = this.props.group;

    if (group.membersCount === 1) {
      groupStr = '1 følger';
    }
    else {
      groupStr = group.membersCount + ' følgere';
    }
    return groupStr;
  }

  render() {
    let group = this.props.group;
    let groupUrl = '/grupper/' + group.id;

    return (<div key={group.id} className="group--tile">
      <a href={groupUrl}>
          <img className="coverimage" src={this.getCoverImageUrl(group)}/>
        <div className="group--title">
          <Icon className="icon" glyph={groupSvg} />
          <span dangerouslySetInnerHTML={{__html: group.name}}/>
        </div>
      </a>
      {this.props.followers &&
      <div>{this.getMembersCountString()}</div> || ''
      }
      {this.props.postsSinceLast &&
        <span className="groups-modal--posts-since-last">
          {this.props.postsSinceLast <= 30 ? this.props.postsSinceLast : '30+'}
        </span> || ''}
    </div>);
  }
}

GroupViewTile.propTypes = {
  group: React.PropTypes.object.isRequired,
  postsSinceLast: React.PropTypes.number,
  followers: React.PropTypes.bool
};

GroupViewTile.displayName = 'GroupViewTile';
