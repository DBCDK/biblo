import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import RoundedButtonSubmit from '../../General/RoundedButton/RoundedButton.submit.component';
import {ProfileLibraryInfo} from '../Edit/ProfileLibraryInfo.component';
import PageLayout from '../../Layout/PageLayout.component';

import * as ProfileActions from '../../../Actions/profile.actions';
import * as EntitySuggestLibraryActions from '../../../Actions/entitySuggetLibrary.actions';
import * as searchActions from '../../../Actions/search.actions';

import './LibraryEditContainer.component.scss';

class LibraryEditContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      loanerId: '',
      pincode: ''
    };
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

    let errorObj = Object.assign({}, this.props.entitySuggest.errorStateObject);
    errorObj.library = (
      <p>
        <strong>
          Dit bibliotek er lukket. Du skal vælge et andet bibliotek i stedet.
        </strong>
        {errorObj.library}
      </p>
    );

    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profile} globalState={this.props.globalState} >
      <div className="profile-library-edit--container">
          <div className="profile-library-edit--form-component-container-container">
            <div className="profile-library-edit--form-component-container">
              <div className="profile-library-edit--profile-image-container">
                <img src={this.props.profile.image.url.medium} className="profile-library-edit--profile-image" />
                <p>
                  <strong>
                    {this.props.profile.displayName}
                  </strong>
                </p>
              </div>

              <form method="post">
                <ProfileLibraryInfo
                  errorObj={errorObj}
                  favoriteLibrary={this.props.profile.favoriteLibrary}
                  unselectLibraryFunction={this.props.libraryActions.unselectLibrary}
                  searchAction={this.librarySearch.bind(this)}
                  searchElements={searchElements}
                  libraryId={this.props.profile.favoriteLibrary.libraryId}
                  loanerIdChangeFunc={(e) => this.setState({loanerId: e.target.value})}
                  pincodeChangeFunc={(e) => this.setState({pincode: e.target.value})}
                  requireAll={false}
                />

                <RoundedButtonSubmit
                  buttonText="OK"
                />
              </form>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
}

LibraryEditContainer.displayName = 'LibraryEditContainer';
LibraryEditContainer.propTypes = {
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
  libraryActions: React.PropTypes.object.isRequired,
  entitySuggest: React.PropTypes.object.isRequired,
  globalState: React.PropTypes.object.isRequired
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
)(LibraryEditContainer);
