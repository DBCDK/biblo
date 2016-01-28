'use strict';

// Libraries
import React from 'react';
import 'normalize.css';

// Components
import GroupForm from '../General/GroupForm.component';
import BackButton from '../../General/BackButton.component';

// SASS
import './_groupcreatecontainer.component.scss';

export default class GroupCreateContainer extends React.Component {
  render() {
    return (
      <div className="group-create">
        <BackButton />
        <h1>Opret gruppe</h1>
        <GroupForm />
      </div>
    );
  }
}

GroupCreateContainer.displayName = 'GroupCreateContainer';
