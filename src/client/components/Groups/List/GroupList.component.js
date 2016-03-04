'use strict';

import React from 'react';
import GroupViewTile from '../View/GroupViewTile.component.js';

export default function GroupList({groups = [], openGroup})  {
  console.log("groups:", groups);
  return (
    <div className='group--list'>
    {
      groups && groups.map((item) => (
        <GroupViewTile key={item.id} group={item} />
      ))
    }
    </div>
  )
}

GroupList.propTypes = {
  groups: React.PropTypes.array.isRequired
};

GroupList.displayName = 'GroupList';
