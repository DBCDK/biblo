'use strict';

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

// SASS
import './_groupcreatecontainer.component.scss';

export class GroupCreateContainer extends React.Component {
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
      actions.asyncSubmitGroupCreateForm(
        group.imageFile,
        name,
        description,
        group.colour
      );
    }
  }

  render() {
    const actions = this.props.actions;
    const group = this.props.group;
    const submit = this.groupFormSubmit.bind(this);

    return (
      <div>
        <PageLayout>
          <div className="group-create">
            <BackButton />
            <h1>Opret gruppe</h1>
            <GroupForm
              changeColourAction={actions.changeGroupColour}
              changeImageAction={actions.asyncChangeImage}
              errors={group.errors}
              groupImageSrc={group.UI.imageSrc}
              submitState={group.UI.submitState}
              submitProgress={group.UI.submitProgress}
              submit={submit} />
          </div>
        </PageLayout>
      </div>
    );
  }
}

GroupCreateContainer.displayName = 'GroupCreateContainer';
GroupCreateContainer.propTypes = {
  group: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      group: state.groupCreateReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      actions: bindActionCreators(groupActions, dispatch)
    };
  }
)(GroupCreateContainer);
