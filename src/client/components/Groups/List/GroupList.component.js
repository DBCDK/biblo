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
    const {title, groups, expand, delta = 15, skip = 0, limit} = this.props;
    var hasMore = true, expand= {};
    if (limit<=groups.length) hasMore= false;

    if (hasMore) {
      return (
        <ExpandButton text="Vis flere"
                      onClick={() => expand(skip, limit + delta)}  />
      );
      ) else {
        return ();
      }
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
      </div>
    );
  }
}

GroupList.propTypes = {
  title: React.PropTypes.string.isRequired,
  groups: React.PropTypes.array.isRequired
};

GroupList.displayName = 'GroupList';


