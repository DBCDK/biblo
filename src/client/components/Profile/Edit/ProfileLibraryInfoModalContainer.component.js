import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as EntitySuggestLibraryActions from '../../../Actions/entitySuggetLibrary.actions';
import {ProfileLibraryInfo} from './ProfileLibraryInfo.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import * as ProfileActions from '../../../Actions/profile.actions';

class ProfileLibraryInfoModalContainer extends React.Component {
  static propTypes = {
    libraryActions: PropTypes.object.isRequired,
    entitySuggest: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    profileActions: PropTypes.object.isRequired,
    onModalCloseClicked: PropTypes.func.isRequired,
    title: PropTypes.string,
    onProfileSaved: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      loanerId: props.profile.favoriteLibrary.loanerId,
      pincode: props.profile.favoriteLibrary.pincode
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile.UI.submitState !== 'SUBMITTED' && nextProps.profile.UI.submitState === 'SUBMITTED' && this.props.onProfileSaved) {
      this.props.onProfileSaved();
    }
  }

  librarySearch(e) {
    if (e && e.target && e.target.value) {
      this.props.libraryActions.asyncFindSuggestedLibraryAction(e.target.value);
    }
  }

  submitLibraryForm(e) {
    e.preventDefault();
    // imageFile, displayname, email, phone, libraryId, loanerId, pincode, description, birthday, fullName, options
    this.props.profileActions.asyncProfileEditSubmit(
      null,
      this.props.profile.displayName,
      this.props.profile.email,
      this.props.profile.phone,
      this.props.profile.favoriteLibrary.libraryId,
      this.state.loanerId,
      this.state.pincode,
      this.props.profile.description,
      this.props.profile.birthday,
      this.props.profile.fullName,
      {
        preventRedirect: true,
        formLocation: '/profil/rediger'
      }
    );
  }

  render() {
    const librarySuggestions = this.props.entitySuggest[this.props.entitySuggest.query].slice(0, 5).map(suggestion => {
      return {
        text: [suggestion.navn, suggestion.by].join(' i '),
        clickFunc: () => this.props.libraryActions.asyncSelectSuggestedLibrary(suggestion)
      };
    });

    return (
      <ModalWindow onClose={this.props.onModalCloseClicked}>
        <div>
          <p>{this.props.title || ''}</p>
          <form onSubmit={this.submitLibraryForm.bind(this)}>
            <ProfileLibraryInfo
              favoriteLibrary={this.props.profile.favoriteLibrary}
              unselectLibraryFunction={this.props.libraryActions.unselectLibrary}
              searchAction={this.librarySearch.bind(this)}
              searchElements={librarySuggestions}
              loanerIdChangeFunc={e => this.setState({loanerId: e.target.value})}
              pincodeChangeFunc={e => this.setState({pincode: e.target.value})}
              requireAll
            />
            <input type="submit" value="OK" className="modal-window--review-button" />
          </form>
        </div>
      </ModalWindow>
    );
  }
}

export default connect(
  state => {
    return {
      entitySuggest: state.entitySuggestReducer,
      profile: state.profileReducer
    };
  },

  dispatch => {
    return {
      libraryActions: bindActionCreators(EntitySuggestLibraryActions, dispatch),
      profileActions: bindActionCreators(ProfileActions, dispatch)
    };
  }
)(ProfileLibraryInfoModalContainer);
