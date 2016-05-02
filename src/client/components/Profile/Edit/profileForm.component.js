import React from 'react';
import ReactDOM from 'react-dom';
import autosize from 'autosize';
import {isEmpty} from 'lodash';

import DroppableImageField from '../../General/DroppableImageField/DroppableImageField.component.js';
import RoundedButtonSubmit from '../../General/RoundedButton/RoundedButton.submit.component.js';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import ProgressBar from '../../General/ProgressBar/ProgressBar.component';
import DisplayNameField from './DisplayNameField.component';
import InputField from '../../General/InputField/InputField.component';
import SearchDropDown from '../../SearchBox/SearchDropDown/SearchDropDown.component.js';
import Message from '../../General/Message/Message.component';

import 'nodep-date-input-polyfill-danish';
import './profileform.component.scss';

export default class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: props.displayName,
      description: props.description,
      email: props.email,
      phone: props.phone,
      libraryId: (props.favoriteLibrary || {}).libraryId || '',
      search: props.search,
      birthday: props.birthday,
      fullName: props.fullName,
      loanerId: '',
      pincode: ''
    };
  }

  componentDidMount() {
    autosize(this.refs.description);

    let elem = ReactDOM.findDOMNode(this.refs['profile-form']);
    elem.onsubmit = (e) => this.props.submit(
      e,
      this.state.displayName,
      this.state.email,
      this.state.phone,
      this.state.libraryId,
      this.state.loanerId,
      this.state.pincode,
      this.state.description,
      this.state.birthday,
      this.state.fullName
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.favoriteLibrary && this.state.libraryId !== nextProps.favoriteLibrary.libraryId) {
      this.setState({libraryId: nextProps.favoriteLibrary.libraryId});
    }
  }

  render() {
    const errorObj = {};
    this.props.errors.forEach((error) => {
      errorObj[error.field] = (
        <Message type='error' >
          <span className={error.field} >{error.errorMessage}</span>
        </Message>
      );
    });

    let disabled = false;
    let submitArea = <RoundedButtonSubmit buttonText="OK" />;

    if (this.props.submitState === 'SUBMITTING') {
      disabled = true;
      submitArea =
        <ProgressBar completed={this.props.submitProgress} height={'35px'} />;
    }
    else if (this.props.submitState === 'UPLOAD_COMPLETE') {
      disabled = true;
      submitArea = (
        <ProgressBar completed={this.props.submitProgress} height={'35px'} >
          <p className="progressbar--message" >Behandler</p>
        </ProgressBar>
      );
    }

    let libraryDescription = '';

    if (this.props.favoriteLibrary && this.props.favoriteLibrary.libraryAddress && this.props.favoriteLibrary.libraryName) {
      libraryDescription = (
        <div>
          {this.props.favoriteLibrary.libraryName} <br />
          {this.props.favoriteLibrary.libraryAddress} <br />
          <RoundedButton clickFunction={() => this.props.unselectLibraryFunction()}
                         buttonText="Klik her for at vælge et andet bibliotek" compact={true} />
        </div>
      );
    }

    let searchField = null;
    if (typeof this.props.favoriteLibrary.libraryName === 'undefined') {
      searchField = (
        <div className="search-area" >
          <InputField
            defaultValue={this.props.search}
            error={errorObj.search}
            onChangeFunc={this.props.searchAction}
            type="text"
            name="search"
            title="Vælg dit bibliotek"
            placeholder="Søg efter dit bibliotek her"
            autocomplete="off"
            disabled={!!(this.props.favoriteLibrary && this.props.favoriteLibrary.libraryName && this.props.favoriteLibrary.libraryAddress)}
            required={!(this.props.favoriteLibrary && this.props.favoriteLibrary.libraryId && this.props.favoriteLibrary.libraryId.length > 0)}
          />
          <SearchDropDown visible={this.props.searchElements.length > 0} elements={this.props.searchElements} />
        </div>
      );
    }

    return (
      <div className={this.props.errors.length > 0 && ' shakeit' || ''} >
        <div className={'profile-form' + (this.props.errors.length > 0 && '' || '')} >
          <form method="POST" encType="multipart/form-data" id="profile_form_component" ref="profile-form" >
            <div className={'profile-image-upload'} >
              <DroppableImageField
                disabled={disabled}
                imageSrc={this.props.profileImageSrc}
                onFile={this.props.changeImageAction}
                fieldName={'profile_image'}
                overlayText={this.props.profileImageSrc === '/no_profile.png'? 'Upload dit billede' : ''}
              />
              {errorObj.profile_image || ''}
            </div>

            {errorObj.general || ''}

            <div className="padded-area" >
              <DisplayNameField
                defaultValue={this.props.displayName}
                errors={errorObj}
                onChangeFunc={(e) => this.setState({displayName: e.target.value})}
                checkDisplayNameFunction={this.props.checkDisplayNameFunction}
                displayNameExists={this.props.displayNameExists}
              />

              <div className="description--form-area" >
                <label>
                  <p>
                    <strong>Beskriv dig selv</strong>
                  </p>
                <textarea
                  placeholder="Her kan du skrive lidt om dig selv"
                  name="description"
                  defaultValue={this.props.description}
                  ref="description"
                  onChange={(e) => this.setState({description: e.target.value})}
                />
                  {errorObj.description || ''}
                </label>
              </div>

              <InputField
                defaultValue={this.props.email}
                error={errorObj.email}
                onChangeFunc={(e) => this.setState({email: e.target.value})}
                type="email"
                name="email"
                title="E-mail (din eller dine forældres)"
                placeholder="E-mail"
              />

              <InputField
                defaultValue={this.props.phone}
                error={errorObj.phone}
                onChangeFunc={(e) => this.setState({phone: e.target.value})}
                type="tel"
                name="phone"
                title="Mobil (din eller dine forældres)"
                placeholder="Mobil"
              />

              <InputField
                defaultValue={this.props.fullName}
                error={errorObj.fullName}
                onChangeFunc={(e) => this.setState({fullName: e.target.value})}
                type="text"
                name="fullName"
                title="Dit rigtige navn"
                placeholder="Dit navn"
              />

              <InputField
                defaultValue={!isEmpty(this.props.birthday) ? (new Date(this.props.birthday)).toISOString().split('T')[0] : ''} // YYYY-MM-DD
                error={errorObj.birthday}
                onChangeFunc={(e) => this.setState({birthday: e.target.value})}
                type="date"
                name="birthday"
                title="Din fødselsdag"
                placeholder="Din fødselsdag"
                min={new Date()}
              />

              <div className="library--form-area" >
                <h3>Dit bibliotek</h3>
                {errorObj.library || ''}

                <div className="selected-library-description" >
                  {libraryDescription}
                </div>

                {searchField}

                <div className='hidden' >
                  <input
                    type='hidden'
                    name='libraryId'
                    value={this.state.libraryId}
                    ref="libraryId"
                  />
                </div>

                <InputField
                  error={errorObj.loanerId}
                  onChangeFunc={(e) => this.setState({loanerId: e.target.value})}
                  type="text"
                  name="loanerId"
                  title="Dit lånernummer"
                  placeholder="Lånernummer"
                />

                <InputField
                  error={errorObj.pincode}
                  onChangeFunc={(e) => this.setState({pincode: e.target.value})}
                  type="text"
                  name="pincode"
                  title="Din pinkode"
                  placeholder="Pinkode"
                />
              </div>

              <div className={'profile-form-submit-button'} >
                {submitArea}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ProfileForm.displayName = 'ProfileForm';
ProfileForm.propTypes = {
  changeImageAction: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array.isRequired,
  profileImageSrc: React.PropTypes.string.isRequired,
  submitState: React.PropTypes.string,
  submitProgress: React.PropTypes.number,
  submit: React.PropTypes.func.isRequired,
  phone: React.PropTypes.string,
  displayName: React.PropTypes.string,
  description: React.PropTypes.string,
  email: React.PropTypes.string,
  favoriteLibrary: React.PropTypes.object,
  searchAction: React.PropTypes.func.isRequired,
  searchElements: React.PropTypes.array.isRequired,
  librarySearchDisabled: React.PropTypes.bool,
  unselectLibraryFunction: React.PropTypes.func.isRequired,
  search: React.PropTypes.string,
  fullName: React.PropTypes.string,
  birthday: React.PropTypes.string,
  checkDisplayNameFunction: React.PropTypes.func.isRequired,
  displayNameExists: React.PropTypes.bool
};

ProfileForm.defaultProps = {
  searchElements: [],
  librarySearchDisabled: false,
  submitProgress: 0,
  displayNameExists: false
};
