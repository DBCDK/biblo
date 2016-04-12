import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import ProfileForm from './profileForm.component';
import PageLayout from '../../Layout/PageLayout.component';

import * as ProfileActions from '../../../Actions/profile.actions';
import * as EntitySuggestLibraryActions from '../../../Actions/entitySuggetLibrary.actions';

import './profileEditContainer.component.scss';

export default class ProfileEditContainer extends React.Component {
  profileEditSubmit(event, displayname, email, phone, libraryId, loanerId, pincode, description, birthday, fullName) {
    const actions = this.props.actions;
    const profile = this.props.profile;

    if (
      'FormData' in window &&
      profile.UI.submitState !== 'SUBMITTING' &&
      profile.UI.submitState !== 'UPLOAD_COMPLETE' &&
      profile.UI.submitState !== 'UPLOAD_FAILED' &&
      profile.UI.submitState !== 'UPLOAD_CANCELED'
    ) {
      event.preventDefault();
      actions.asyncProfileEditSubmit(
        profile.imageFile,
        displayname,
        email,
        phone,
        libraryId,
        loanerId,
        pincode,
        description,
        birthday,
        fullName
      );
    }
  }

  librarySearch(e) {
    if (e && e.target && e.target.value) {
      this.props.libraryActions.asyncFindSuggestedLibraryAction(e.target.value);
    }
  }

  render() {

    let searchElements = this.props.entitySuggest[this.props.entitySuggest.query].slice(0, 5).map((suggestion) => {
      return {
        text: [suggestion.navn, suggestion.by].join(' i '),
        clickFunc: () => this.props.libraryActions.asyncSelectSuggestedLibrary(suggestion)
      };
    });

    return (
      <PageLayout>
        <div className="profile-edit--container">
          <h1 className="profile-edit--title">Redigér Profil</h1>
          <div className="profile-edit--form-component-container-container">
            <div className="before-profile-edit--form-component-container">
              <br />
            </div>
            <div className="profile-edit--form-component-container">
              <ProfileForm
                changeImageAction={this.props.actions.asyncChangeProfileImage}
                submit={this.profileEditSubmit.bind(this)}
                errors={this.props.profile.errors || []}
                profileImageSrc={((this.props.profile.image || {}).url || {}).small}
                submitState={this.props.profile.UI.submitState}
                submitProgress={this.props.profile.UI.submitProgress}
                fullName={this.props.profile.fullName}
                birthday={this.props.profile.birthday}
                phone={this.props.profile.phone}
                displayName={this.props.profile.displayName}
                description={this.props.profile.description}
                email={this.props.profile.email}
                favoriteLibrary={this.props.profile.favoriteLibrary || {}}
                searchAction={this.librarySearch.bind(this)}
                searchElements={searchElements}
                unselectLibraryFunction={this.props.libraryActions.unselectLibrary}
                checkDisplayNameFunction={this.props.actions.asyncCheckDisplayNameExists}
                displayNameExists={this.props.profile.displayNameExists}
              />
            </div>
            <div className="after-profile-edit--form-component-container">
              <br />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
}

ProfileEditContainer.displayName = 'ProfileEditContainer';
ProfileEditContainer.propTypes = {
  profile: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
  libraryActions: React.PropTypes.object.isRequired,
  entitySuggest: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profile: state.profileReducer,
      entitySuggest: state.entitySuggestReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      actions: bindActionCreators(ProfileActions, dispatch),
      libraryActions: bindActionCreators(EntitySuggestLibraryActions, dispatch)
    };
  }
)(ProfileEditContainer);
