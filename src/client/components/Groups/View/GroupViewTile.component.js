'use strict';

import React from 'react';
import './scss/group-view.scss';

export default class GroupViewTile extends React.Component {

  render() {
    var group = this.props.group;
    console.log(group);
    if (group.coverImage) {
        group.url = "//api"
    }
    group.url = "http://lorempixel.com/120/120/";

    var groupStr;
    if (group.membersCount == 1 ) {
        groupStr = "1 følger"
    }  else {
        groupStr = group.membersCount + " følgere";
    }
    var groupUrl = "/grupper/" + group.id;

    return (
       <div className="group--tile" key={group.id}>
          <a href={groupUrl}><img src={group.url} /></a>
          <div className="group--title">{group.name} </div>
          <div className="group--followers">{groupStr} </div>
       </div>
   )}
}

GroupViewTile.propTypes = {
    group: React.PropTypes.object.isRequired
};

GroupViewTile.displayName = 'GroupViewTile';
