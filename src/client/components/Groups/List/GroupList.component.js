import React from 'react';
import PropTypes from 'prop-types';
import GroupViewTile from '../View/GroupViewTile.component.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';

import './scss/group-list.scss';

export default class GroupList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {title, groups, expand, delta = 15, skip = 0, limit, isLoading} = this.props;

    let hasMore = true;
    if (limit > groups.length) {
      hasMore = false;
    }

    let expandButton;

    if (hasMore && expand) {
      expandButton = (
        <ExpandButton
          className="group-showmore"
          text="Vis flere"
          isLoading={isLoading}
          onClick={()=> expand(skip, parseInt(limit, 10) + parseInt(delta, 10))}
        />
      );
    }

    return (
      <div>
        <h2>{title}</h2>
        <hr/>
        <div className="group--list">
          {
            groups && groups.map((item) => (
              <GroupViewTile key={item.id} group={item} followers={true}/>
            ))
          }
          <div className="group--showmore">
            {expandButton}
          </div>

        </div>

      </div>
    );
  }
}

GroupList.propTypes = {
  title: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
  groupActions: PropTypes.array,
  delta: PropTypes.number,
  skip: PropTypes.number,
  limit: PropTypes.number,
  isLoading: PropTypes.bool,
  followOn: PropTypes.bool,
  expand: PropTypes.func
};

GroupList.displayName = 'GroupList';
