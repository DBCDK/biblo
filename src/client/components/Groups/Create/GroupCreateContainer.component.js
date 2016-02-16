'use strict';

// Libraries
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// Components
import GroupForm from '../General/GroupForm.component';
import BackButton from '../../General/BackButton.component';

// Actions
import * as groupActions from '../../../Actions/group.actions';

// SASS
import './_groupcreatecontainer.component.scss';

export class GroupCreateContainer extends React.Component {
  groupFormSubmit(event, name, description) {
    if ('FormData' in window) {
      event.preventDefault();
      this.props.actions.asyncSubmitGroupCreateForm(
        this.props.group.imageFile,
        name,
        description,
        this.props.group.colour
      );
    }
  }

  render() {
    return (
      <div className="group-create">
        <BackButton />
        <h1>Opret gruppe</h1>
        <GroupForm
          changeColourAction={this.props.actions.changeGroupColour}
          changeImageAction={this.props.actions.asyncChangeImage}
          groupImageSrc={this.props.group.UI.imageSrc}
          submit={this.groupFormSubmit.bind(this)} />
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
