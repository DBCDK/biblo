'use strict';

import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as groupActions from '../../Actions/group.actions';

import PageLayout from '../Layout/PageLayout.component.js';

import GroupList from './List/GroupList.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component.js';
import {CREATE_GROUP_LINK} from '../../Constants/hyperlinks.constants';

export class GroupsContainer extends React.Component {
  render() {
    return (
      <PageLayout>
        <h1>Velkommen til grupper!</h1>
        <RoundedButton buttonText='Opret en gruppe!' href={CREATE_GROUP_LINK}/>
        <GroupList groups={this.props.groups}/>
      </PageLayout>
    );
  }
}

GroupsContainer.displayName = 'GroupsContainer';
GroupsContainer.propTypes = {
  groups: React.PropTypes.array
};

export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      groups: state.listGroupsReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      actions: bindActionCreators(groupActions, dispatch)
    };
  }
)(GroupsContainer);
