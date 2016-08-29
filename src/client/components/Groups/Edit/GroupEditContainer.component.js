import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../../Layout/PageLayout.component';
import BackButton from '../../General/BackButton/BackButton.component';
import GroupForm from '../General/GroupForm.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';

import * as groupActions from '../../../Actions/group.actions';
import * as searchActions from '../../../Actions/search.actions';
import * as uiActions from '../../../Actions/ui.actions';

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

  closeDeleteModal() {
    if (this.props.group.deleted) {
      window.location = `/grupper/${this.props.group.id}`;
    }
    else {
      this.props.uiActions.closeModalWindow();
    }
  }

  renderDeleteModal() {

    if (!this.props.ui.modal.isOpen) {
      return;
    }

    return (
      <ModalWindow onClose={this.closeDeleteModal.bind(this)} title="Slet gruppe">
        <div className="group-delete">
          <div className="group-delete--image">
            <img className="coverimage" src={this.props.group.image} alt={this.props.group.name}/>
          </div>
          {(this.props.group.deleted.success) &&
          <div className="group-delete--deleted">
            <h3>Gruppen er slettet</h3>
            <a className="group-delete--done" href="#" onClick={this.closeDeleteModal.bind(this)}>OK</a>
          </div> ||
          <div>
            <h3 className="group-delete--text">Er du sikker på du vil slette gruppen:</h3>
            <div className="group-delete--title">{this.props.group.name}</div>
            {this.props.group.deleted.error &&
            <div className={"message error shakeit"}>
              Du kan ikke slette gruppen
            </div>
            ||
            <div>
              <a className="group-delete--cancel" href="#" onClick={this.closeDeleteModal.bind(this)}>Fortryd</a>
              <a className="group-delete--confirm" href="#"
                 onClick={this.props.actions.asyncGroupDelete.bind(null, this.props.group.id)}>Ja, slet gruppen</a>
            </div>
            }
          </div>
          }</div>
      </ModalWindow>);
  }

  render() {
    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profileState} globalState={this.props.globalState} >
      <BackButton />
        <h1 className="group-edit--header">Redigér gruppe</h1>
        <GroupForm
          changeImageAction={this.props.actions.asyncChangeImage}
          errors={this.props.group.errors}
          groupImageSrc={this.props.group.UI.imageSrc}
          submitState={this.props.group.UI.submitState}
          submitProgress={this.props.group.UI.submitProgress}
          submit={this.groupFormSubmit.bind(this)}
          delete={this.props.profileState.isModerator && this.props.uiActions.openModalWindow}
          defaultValues={{
            'group-name': this.props.group.raw.name,
            'group-description': this.props.group.raw.description
          }}
        />
        {this.renderDeleteModal()}
      </PageLayout>
    );
  }
}

GroupEditContainer.displayName = 'GroupEditContainer';
GroupEditContainer.propTypes = {
  profileState: React.PropTypes.object.isRequired,
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired,
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
      group: state.groupEditReducer,
      ui: state.uiReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      actions: bindActionCreators(groupActions, dispatch),
      uiActions: bindActionCreators(uiActions, dispatch)
    };
  }
)(GroupEditContainer);
