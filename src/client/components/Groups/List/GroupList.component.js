'use strict';

import React from 'react';
import GroupViewTile from '../View/GroupViewTile.component.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';


export default
class GroupList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {title, groups, actions, delta = 15, skip = 0, limit} = this.props;
    return (
      <div className='group--list'>
        <h2>{title}</h2>
        <hr/>
        {
          groups && groups.map((item) => (
            <GroupViewTile key={item.id} group={item}/>
          ))
        }
        <ExpandButton text="Vis flere" onClick={() => actions.asyncShowGroups(skip + delta, limit)}  />
      </div>
    );
  }
}

GroupList.propTypes = {
  title: React.PropTypes.string.isRequired,
  groups: React.PropTypes.array.isRequired
};

GroupList.displayName = 'GroupList';


