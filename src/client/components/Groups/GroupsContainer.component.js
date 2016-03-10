'use strict';

import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as groupActions from '../../Actions/group.actions';

import PageLayout from '../Layout/PageLayout.component.js';

import GroupList from './List/GroupList.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component.js';
import {CREATE_GROUP_LINK} from '../../Constants/hyperlinks.constants';

import Icon from '../General/Icon/Icon.component.js';
import groupSvg from '../General/Icon/svg/functions/group.svg';

import './GroupsContainer.scss';


export class GroupsContainer extends React.Component {
  render() {
    const {data, actions} = this.props;
    return (
      <PageLayout>
        <div className="header">
          <div className="iconcontainer">
            <Icon className="icon" height='100' width='100' glyph={groupSvg}/>
          </div>
          <div className="description">
            <div className="text">
            <h2>Grupper</h2>
            Her kan du deltage, se hvad andre skriver og uploader. Du kan også lave din egen gruppe - om det du
            interesserer
            dig mest for. Du kan spørge gruppeværterne i alle grupperne om mere information.
              </div>
          </div>
        </div>
        <div className="lists">
          <RoundedButton buttonText='Opret ny gruppe' href={CREATE_GROUP_LINK}/>
          <GroupList title="Nyeste grupper" groups={data.groups} limit={data.groupsLimit}
                     isLoading={data.loadingGroups} expand={actions.asyncShowGroups} actions={actions}/>
        </div>

      </PageLayout>
    );
  }
}

GroupsContainer.displayName = 'GroupsContainer';
GroupsContainer.propTypes = {
  actions: React.PropTypes.object,
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
