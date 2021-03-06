import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as groupActions from '../../Actions/group.actions';
import * as searchActions from '../../Actions/search.actions';
import * as profileActions from '../../Actions/profile.actions';

import PageLayout from '../Layout/PageLayout.component.js';

import GroupList from './List/GroupList.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component.js';
import ColoredHeader from '../General/ColoredHeader/ColoredHeader.component.js';
import {CREATE_GROUP_LINK} from '../../Constants/hyperlinks.constants';

import groupSvg from '../General/Icon/svg/functions/group.svg';

import './GroupsContainer.scss';

export class GroupsContainer extends React.Component {
  render() {
    const text =
      'Her kan du finde alle Biblos grupper. Du kan også lave din egen. Søg efter grupper på den lilla knap øverst på siden.';
    const {data, actions} = this.props;
    return (
      <PageLayout
        searchState={this.props.searchState}
        searchActions={this.props.searchActions}
        profileState={this.props.profileState}
        globalState={this.props.globalState}
        profileActions={this.props.profileActions}
      >
        <div className="group-page--header">
          <ColoredHeader text={text} title={'Grupper'} iconGlyph={groupSvg} />
        </div>
        <div className="lists">
          <RoundedButton buttonText="Opret ny gruppe" href={CREATE_GROUP_LINK} />

          <GroupList
            title="Populære grupper"
            groups={data.popularGroups}
            limit={data.popularLimit}
            isLoading={data.popularLoading}
            expand={actions.asyncShowGroups.bind(null, 'popular')}
            actions={actions}
          />

          <GroupList
            title="Nyeste grupper"
            groups={data.newGroups}
            limit={data.newLimit}
            isLoading={data.newLoading}
            expand={actions.asyncShowGroups.bind(null, 'new')}
            actions={actions}
          />
        </div>
      </PageLayout>
    );
  }
}

GroupsContainer.displayName = 'GroupsContainer';
GroupsContainer.propTypes = {
  profileState: PropTypes.object.isRequired,
  profileActions: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  searchActions: PropTypes.object.isRequired,
  actions: PropTypes.object,
  data: PropTypes.object,
  globalState: PropTypes.object
};

export default connect(
  // Map redux state to group prop
  state => {
    return {
      profileState: state.profileReducer,
      searchState: state.searchReducer,
      data: state.listGroupsReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  dispatch => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      actions: bindActionCreators(groupActions, dispatch),
      profileActions: bindActionCreators(profileActions, dispatch)
    };
  }
)(GroupsContainer);
