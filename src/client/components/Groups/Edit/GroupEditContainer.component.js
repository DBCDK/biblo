import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../../Layout/PageLayout.component';
import BackButton from '../../General/BackButton/BackButton.component';
import GroupForm from '../General/GroupForm.component';

import * as groupActions from '../../../Actions/group.actions';

import './groupeditcontainer.component.scss';

export class GroupEditContainer extends React.Component {
  groupFormSubmit(event, name, description) {
    const actions = this.props.actions;
    const group = this.props.group;

    if (
      'FormData' in window &&
      group.UI.submitState !== 'SUBMITTING' &&
      group.UI.submitState !== 'UPLOAD_COMPLETE' &&
      group.UI.submitState !== 'UPLOAD_FAILED' &&
      group.UI.submitState !== 'UPLOAD_CANCELED'
    ) {
      event.preventDefault();
      actions.asyncSubmitGroupEditForm(
        group.imageFile,
        name,
        description
      );
    }
  }

  render() {
    return (
      <PageLayout>
        <BackButton />
        <h1 className="group-edit--header">Redigér gruppe</h1>
        <GroupForm
          changeImageAction={this.props.actions.asyncChangeImage}
          errors={this.props.group.errors}
          groupImageSrc={this.props.group.UI.imageSrc}
          submitState={this.props.group.UI.submitState}
          submitProgress={this.props.group.UI.submitProgress}
          submit={this.groupFormSubmit.bind(this)}
          defaultValues={{
            'group-name': this.props.group.raw.name,
            'group-description': this.props.group.raw.description
          }}
        />
      </PageLayout>
    );
  }
}

GroupEditContainer.displayName = 'GroupEditContainer';
GroupEditContainer.propTypes = {
  actions: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      group: state.groupEditReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      actions: bindActionCreators(groupActions, dispatch)
    };
  }
)(GroupEditContainer);
