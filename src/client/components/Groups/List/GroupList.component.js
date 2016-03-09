'use strict';

import React from 'react';
import GroupViewTile from '../View/GroupViewTile.component.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';

import './scss/group-list.scss';


export default
class GroupList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {title, groups, actions, delta = 15, skip = 0, limit} = this.props;
    console.log(actions);
    var hasMore = true, expand= {};
    if (limit<=groups.length) hasMore= false;

    var expandButton;
    if (hasMore) {
      expandButton = <ExpandButton text="Vis flere"
                                   isLoading=={()=> actions.moreGroupsLoading}
                                   onClick={()=> actions.asyncShowGroups(skip, limit + delta)}/>;
    }

    return (
      <div className="group--list">
        <h2>{title}</h2>
        <hr/>
        {
          groups && groups.map((item) => (
            <GroupViewTile key={item.id} group={item}/>
          ))
        }
        {expandButton}
      </div>
    );
  }
}

GroupList.propTypes = {
  title: React.PropTypes.string.isRequired,
  groups: React.PropTypes.array.isRequired
};

GroupList.displayName = 'GroupList';


