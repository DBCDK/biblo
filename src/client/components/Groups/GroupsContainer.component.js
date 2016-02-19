'use strict';

import React from 'react';
import GroupSearch from './Search/GroupSearch.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component.js';
import {CREATE_GROUP_LINK} from '../../Constants/hyperlinks.constants';

export default class GroupsContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Velkommen til grupper!</h1>
        <GroupSearch />
        <RoundedButton buttonText='Opret en gruppe!' href={CREATE_GROUP_LINK} />
      </div>
    );
  }
}

GroupsContainer.displayName = 'GroupsContainer';
