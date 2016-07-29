import React from 'react';
import ReactDOM from 'react-dom';
import autosize from 'autosize';
import {isEmpty} from 'lodash';
import dateformat from '../../../Utils/dateInputPolyfill/dateformat';

import DroppableImageField from '../../General/DroppableImageField/DroppableImageField.component.js';
import RoundedButtonSubmit from '../../General/RoundedButton/RoundedButton.submit.component.js';
import ProgressBar from '../../General/ProgressBar/ProgressBar.component';
import DisplayNameField from './DisplayNameField.component';
import {InputField} from '../../General/InputField/InputField.component';
import Message from '../../General/Message/Message.component';
import {ProfileLibraryInfo} from './ProfileLibraryInfo.component';

import '../../../Utils/dateInputPolyfill/date-input-polyfill';
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

    const elem = ReactDOM.findDOMNode(this.refs['profile-form']);
    elem.onsubmit = (e) => {
      const birthday = !isEmpty(this.state.birthday) ? dateformat(this.state.birthday, 'yyyy-mm-dd') : '';
      this.props.submit(
        e,
        this.state.displayName,
        this.state.email,
        this.state.phone,
        this.state.libraryId,
        this.state.loanerId,
        this.state.pincode,
        this.state.description,
        birthday,
        this.state.fullName
      );
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.favoriteLibrary && this.state.libraryId !== nextProps.favoriteLibrary.libraryId) {
      this.setState({libraryId: nextProps.favoriteLibrary.libraryId});
    }
  }

  renderSubmitArea(submitState) {
    switch (submitState) {
      case 'SUBMITTING': {
        return <ProgressBar completed={this.props.submitProgress} height={'43px'}/>;
      }
      case 'UPLOAD_COMPLETE': {
        return (
          <ProgressBar completed={this.props.submitProgress} height={'43px'}>
            <p className="progressbar--message">Behandler</p>
          </ProgressBar>
        );
      }
      case 'SUBMITTED': {
        return <RoundedButtonSubmit buttonText="GEMT"/>;
      }
      default: {
        return <RoundedButtonSubmit buttonText="OK"/>;
      }
    }
  }

  render() {
    const errorObj = {};
    this.props.errors.forEach((error) => {
      errorObj[error.field] = (
        <Message type='error'>
          <span className={error.field}>{error.errorMessage}</span>
        </Message>
      );
    });

    const disabled = !!(this.props.submitState === 'SUBMITTING' || this.props.submitState === 'UPLOAD_COMPLETE');
    const submitArea = this.renderSubmitArea(this.props.submitState);
    const birthday = !isEmpty(this.props.birthday) ? dateformat(this.props.birthday, 'yyyy-mm-dd') : '';

    return (
      <div className={this.props.errors.length > 0 && ' shakeit' || ''}>
        <div className={'profile-form' + (this.props.errors.length > 0 && '' || '')}>
          <form method="POST" encType="multipart/form-data" id="profile_form_component" ref="profile-form">
            <div className={'profile-image-upload'}>
              <DroppableImageField
                disabled={disabled}
                imageSrc={this.props.profileImageSrc}
                onFile={this.props.changeImageAction}
                fieldName={'profile_image'}
                overlayText={this.props.profileImageSrc === '/no_profile.png' ? 'Upload dit billede' : ''}
              />
              {errorObj.profile_image || ''}
            </div>

            {errorObj.general || ''}

            <div className="padded-area">
              <DisplayNameField
                defaultValue={this.props.displayName}
                errors={errorObj}
                onChangeFunc={(e) => this.setState({displayName: e.target.value})}
                checkDisplayNameFunction={this.props.checkDisplayNameFunction}
                displayNameExists={this.props.displayNameExists}
              />

              <div className="description--form-area">
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
                defaultValue={birthday}
                error={errorObj.birthday}
                onChangeFunc={(e) => this.setState({birthday: e.target.value})}
                type="date"
                name="birthday"
                title="Din fødselsdag"
                placeholder="Din fødselsdag"
                format="dd/mm/yyyy"
                data-date-format="dd/mm/yyyy"
              />


              <ProfileLibraryInfo
                errorObj={errorObj}
                favoriteLibrary={this.props.favoriteLibrary}
                unselectLibraryFunction={this.props.unselectLibraryFunction}
                search={this.props.search}
                searchAction={this.props.searchAction}
                searchElements={this.props.searchElements}
                libraryId={this.state.libraryId}
                loanerIdChangeFunc={(e) => this.setState({loanerId: e.target.value})}
                pincodeChangeFunc={(e) => this.setState({pincode: e.target.value})}/>

              <div className={'profile-form-submit-button'}>
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
