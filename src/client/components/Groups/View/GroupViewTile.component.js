'use strict';

import React from 'react';
import './scss/group-view.scss';

export default class GroupViewTile extends React.Component {

  getMembersCountString() {
    var groupStr,
       group = this.props.group;

    if (group.membersCount == 1) {
      groupStr = "1 følger"
    } else {
      groupStr = group.membersCount + " følgere";
    }
    return groupStr;
  }

  render() {
    var group    = this.props.group,
        groupStr = this.getMembersCountString();

    if (group.membersCount == 1) {
      groupStr = "1 følger"
    } else {
      groupStr = group.membersCount + " følgere";
    }

    var groupUrl = "/grupper/" + group.id;

    return (
      <div className="group--tile" key={group.id}>
        <div>
        <a href={groupUrl}>
          <img className="group--coverimage" src={this.getCoverImageUrl()} align="middle" />
          <img className="group--coverbadge" src="no_group_image.png" />
        </a>
        </div>
        <div className="group--caption">
           <div className="group--title">{group.name} </div>
           <div className="group--followers">{groupStr} </div>
        </div>
      </div>
    )
  }

  getCoverImageUrl() {
    var url,
      group = this.props.group;
    if (group.coverImage) {
      url = "/billede/" + group.coverImage.id +"/small"
    } else {
      url = "http://lorempixel.com/120/120/";
    }
    return url;
  }

}

GroupViewTile.propTypes = {
  group: React.PropTypes.object.isRequired
};

GroupViewTile.displayName = 'GroupViewTile';
