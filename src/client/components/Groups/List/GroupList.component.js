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
    const {title, groups, expand, delta = 15, skip = 0, limit, isLoading} = this.props;
    var hasMore = true;
    if (limit > groups.length) {
      hasMore = false;
    }

    var expandButton;
    if (hasMore) {
      expandButton = (
        <ExpandButton className="group-showmore" text="Vis flere"
                      isLoading={isLoading}
                      onClick={()=> expand(skip, parseInt(limit, 10) + parseInt(delta, 10))}/>
      );
    }

    return (
      <div className="group--list">
        <h2>{title}</h2>
        {
          groups && groups.map((item) => (
            <GroupViewTile key={item.id} group={item}/>
          ))
        }
        <div className="group--showmore">
        {expandButton}
        </div>
      </div>
    );
  }
}

GroupList.propTypes = {
  title: React.PropTypes.string.isRequired,
  groups: React.PropTypes.array.isRequired,
  delta: React.PropTypes.number,
  skip: React.PropTypes.number,
  limit: React.PropTypes.number,
  isLoading: React.PropTypes.bool

};

GroupList.displayName = 'GroupList';


