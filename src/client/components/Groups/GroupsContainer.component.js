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
    const {data, actions} = this.props;
    return (
      <PageLayout>
        <RoundedButton buttonText='Opret en gruppe!' href={CREATE_GROUP_LINK}/>
        <GroupList title="Velkommen til grupper!" groups={data.groups} limit={data.groupsLimit} isLoading={data.loadingGroups} expand={actions.asyncShowGroups} actions = {actions} />
      </PageLayout>
    );
  }
}

GroupsContainer.displayName = 'GroupsContainer';
GroupsContainer.propTypes = {
  data: React.PropTypes.object
};

export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      data: state.listGroupsReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      actions: bindActionCreators(groupActions, dispatch)
    };
  }
)(GroupsContainer);
