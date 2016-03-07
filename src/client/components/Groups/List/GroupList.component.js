'use strict';

import React from 'react';
import GroupViewTile from '../View/GroupViewTile.component.js';

export default function GroupList({title, groups = []}) {
  return (
    <div className='group--list'>
      <h2>{title}</h2>
      <hr/>
      {
        groups && groups.map((item) => (
          <GroupViewTile key={item.id} group={item}/>
        ))
      }
    </div>
  );
}

GroupList.propTypes = {
  title: React.PropTypes.string.isRequired,
  groups: React.PropTypes.array.isRequired
};

GroupList.displayName = 'GroupList';
