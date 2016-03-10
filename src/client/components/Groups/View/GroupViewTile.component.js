'use strict';

import React from 'react';

import './scss/group-tile.scss';

import Icon from '../../General/Icon/Icon.component.js';
import groupSvg from '../../General/Icon/svg/functions/group.svg';


export default class GroupViewTile extends React.Component {

  render() {
    var group = this.props.group; // groupStr = this.getMembersCountString();

    var groupUrl = '/grupper/' + group.id;

    return (
      <div className="group--tile" key={group.id}>
        <div>
          <a href={groupUrl}>
            <img className="coverimage" src={this.getCoverImageUrl()} align="middle"/>
          </a>
        </div>
        <div className="group--caption">
          <div className="group--title"><Icon className="icon" glyph={groupSvg}/> {group.name} </div>
       </div>
      </div>
    );
  }

  getCoverImageUrl() {
    var url,
      group = this.props.group;

    if (group.coverImage) {
      url = '/billede/' + group.coverImage.id + '/small';
    }
    else {
      url = 'http://lorempixel.com/120/120/';
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

}

GroupViewTile.propTypes = {
  group: React.PropTypes.object.isRequired
};

GroupViewTile.displayName = 'GroupViewTile';
