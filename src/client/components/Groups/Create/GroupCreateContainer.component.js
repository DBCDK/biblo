// Libraries
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// Components
import GroupForm from '../General/GroupForm.component';
import BackButton from '../../General/BackButton/BackButton.component.js';
import PageLayout from '../../Layout/PageLayout.component';

// Actions
import * as groupActions from '../../../Actions/group.actions';
import * as searchActions from '../../../Actions/search.actions';

// SASS
import './_groupcreatecontainer.component.scss';

export class GroupCreateContainer extends React.Component {
  groupFormSubmit(event, name, description) {
    const actions = this.props.groupActions;
    const group = this.props.group;

    if (
      'FormData' in window &&
      group.UI.submitState !== 'SUBMITTING' &&
      group.UI.submitState !== 'UPLOAD_COMPLETE' &&
      group.UI.submitState !== 'UPLOAD_FAILED' &&
      group.UI.submitState !== 'UPLOAD_CANCELED'
    ) {
      event.preventDefault();
      actions.asyncSubmitGroupCreateForm(
        group.imageFile,
        name,
        description
      );
    }
  }

  render() {
    const actions = this.props.groupActions;
    const group = this.props.group;
    const submit = this.groupFormSubmit.bind(this);

    return (
      <div>
        <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profileState} globalState={this.props.globalState} >
        <div className="group-create">
            <BackButton />
            <h1>Opret gruppe</h1>
            <GroupForm
              changeImageAction={actions.asyncChangeImage}
              errors={group.errors}
              groupImageSrc={group.UI.imageSrc}
              submitState={group.UI.submitState}
              submitProgress={group.UI.submitProgress}
              submit={submit}
              checkedNames={group.checkedNames}
              checkIfGroupNameExistsAction={groupName => actions.callServiceProvider('checkIfGroupNameExists', {groupName})}
            />
          </div>
        </PageLayout>
      </div>
    );
  }
}

GroupCreateContainer.displayName = 'GroupCreateContainer';
GroupCreateContainer.propTypes = {
  profileState: React.PropTypes.object.isRequired,
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired,
  groupActions: React.PropTypes.object.isRequired,
  globalState: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profileState: state.profileReducer,
      searchState: state.searchReducer,
      group: state.groupCreateReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      groupActions: bindActionCreators(groupActions, dispatch)
    };
  }
)(GroupCreateContainer);
