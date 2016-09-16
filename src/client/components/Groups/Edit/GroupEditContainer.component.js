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

  closeModal() {
    if (this.props.group.moderation.success) {
      window.location = `/grupper/${this.props.group.id}`;
    }
    else {
      this.props.uiActions.closeModalWindow();
    }
  }

  renderModerationModal() {
    if (!this.props.ui.modal.isOpen) {
      return;
    }

    const modals = {
      open: {
        title: 'Åben gruppe',
        texts: {
          confirm: 'Er du sikker på du vil åbne gruppen:',
          button: 'Ja, åben gruppen',
          done: 'Gruppen er åben',
          error: 'Du kan ikke åbne gruppen'
        },
        action: this.props.actions.asyncGroupToggleClose.bind(null, this.props.group.id, false)
      },
      close: {
        title: 'Luk gruppe',
        texts: {
          confirm: 'Er du sikker på du vil lukke gruppen:',
          button: 'Ja, luk gruppen',
          done: 'Gruppen er lukket',
          error: 'Du kan ikke lukke gruppen'
        },
        action: this.props.actions.asyncGroupToggleClose.bind(null, this.props.group.id, true)
      },
      delete: {
        title: 'Slet gruppe',
        texts: {
          confirm: 'Er du sikker på du vil slette gruppen:',
          button: 'Ja, slet gruppen',
          done: 'Gruppen er slettet',
          error: 'Du kan ikke slette gruppen'
        },
        action: this.props.actions.asyncGroupDelete.bind(null, this.props.group.id)
      }
    };

    const type = this.props.ui.modal.children;
    const {title, texts, action} = modals[type];
    const close = () => this.closeModal();

    return (
      <ModalWindow onClose={close} title={title}>
        <div className={`group-moderation ${type}`}>
          <div className="group-moderation--image">
            <img className="coverimage" src={this.props.group.image} alt={this.props.group.name}/>
          </div>
          {(this.props.group.moderation.success) &&
          <div className="group-moderation--done">
            <h3>{texts.done}</h3>
            <a className="group-moderation--done--button" href="#" onClick={close}>OK</a>
          </div> ||
          <div>
            <h3 className="group-moderation--text">{texts.confirm}</h3>
            <div className="group-moderation--title">{this.props.group.name}</div>
            {this.props.group.moderation.error &&
            <div className={"message error shakeit"}>
              {texts.error}
            </div>
            ||
            <div>
              <a className="group-moderation--cancel" href="#" onClick={close}>Fortryd</a>
              <a className="group-moderation--confirm" href="#"
                 onClick={action}>{texts.button}</a>
            </div>
            }
          </div>
          }</div>
      </ModalWindow>
    );
  }

  renderModerationButtons() {
    const action = this.props.uiActions.openModalWindow.bind(this);
    return (
      <div className="group-form--moderation">
        <a href="#delete" onClick={ () => action('delete') }>Slet gruppen</a>
        {this.props.group.timeClosed &&
        <a href="#close" onClick={() => action('open')}>Åben gruppe</a> ||
        <a href="#close" onClick={() => action('close')}>luk gruppe</a>
        }
      </div>
    );
  }

  render() {
    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions}
                  profileState={this.props.profileState} globalState={this.props.globalState}>
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
          moderation={this.props.profileState.isModerator && this.renderModerationButtons() || ''}
        />
        {this.renderModerationModal()}
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
