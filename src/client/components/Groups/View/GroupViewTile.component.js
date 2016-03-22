'use strict';

import React from 'react';

import './scss/group-tile.scss';

import Icon from '../../General/Icon/Icon.component.js';
import groupSvg from '../../General/Icon/svg/functions/group.svg';


export default class GroupViewTile extends React.Component {

  getCoverImageUrl() {
    var url,
      group = this.props.group;

    if (group.coverImage) {
      url = '/billede/' + group.coverImage.id + '/small-square';
    }
    else {
      url = '/no_group_image.png';
    }
    return url;
  }

  getMembersCountString() {
    var groupStr,
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
    var group = this.props.group;
    var groupUrl = '/grupper/' + group.id;

    return (<div key={group.id} className="group--tile">
      <div>
        <a href={groupUrl}>
          <img className="coverimage" src={this.getCoverImageUrl()}/>
        </a>
      </div>
      <div>
        <div className="group--title"><Icon className="icon" glyph={groupSvg}/> {group.name} </div>
        <div> {this.getMembersCountString()} </div>
      </div>
    </div>);
  }
}

GroupViewTile.propTypes = {
  group: React.PropTypes.object.isRequired
};

GroupViewTile.displayName = 'GroupViewTile';
