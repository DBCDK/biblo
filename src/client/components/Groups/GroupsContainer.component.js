'use strict';

import React from 'react';
import GroupSearch from './Search/GroupSearch.component';

export default class GroupsContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Velkommen til grupper!</h1>
        <GroupSearch />
      </div>
    );
  }
}

GroupsContainer.displayName = 'GroupsContainer';
