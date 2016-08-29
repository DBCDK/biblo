import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import ProfileForm from './profileForm.component';
import PageLayout from '../../Layout/PageLayout.component';

import * as ProfileActions from '../../../Actions/profile.actions';
import * as EntitySuggestLibraryActions from '../../../Actions/entitySuggetLibrary.actions';
import * as searchActions from '../../../Actions/search.actions';

import './profileEditContainer.component.scss';

class ProfileEditContainer extends React.Component {
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

    const searchElements = this.props.entitySuggest[this.props.entitySuggest.query].slice(0, 20).map((suggestion) => {
      return {
        text: [suggestion.navn, suggestion.by].join(' i '),
        clickFunc: () => this.props.libraryActions.asyncSelectSuggestedLibrary(suggestion)
      };
    });

    let form_title = 'Opret Profil';

    if (this.props.profile.hasFilledInProfile) {
      form_title = 'Redigér Profil';
    }

    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profile} globalState={this.props.globalState} >

        <div className="profile-edit--container">
          <h1 className="profile-edit--title">{form_title}</h1>
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
  searchState: React.PropTypes.object.isRequired,
  globalState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
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
      searchState: state.searchReducer,
      profile: state.profileReducer,
      entitySuggest: state.entitySuggestReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      actions: bindActionCreators(ProfileActions, dispatch),
      libraryActions: bindActionCreators(EntitySuggestLibraryActions, dispatch)
    };
  }
)(ProfileEditContainer);
