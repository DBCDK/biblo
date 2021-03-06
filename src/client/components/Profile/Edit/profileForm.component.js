import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import {isEmpty} from 'lodash';
import dateformat from '../../../Utils/dateInputPolyfill/dateformat';
import sanitizeHtml from './../../../Utils/sanitizeHtml.util';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import DroppableImageField from '../../General/DroppableImageField/DroppableImageField.component.js';
import RoundedButtonSubmit from '../../General/RoundedButton/RoundedButton.submit.component.js';
import ProgressBar from '../../General/ProgressBar/ProgressBar.component';
import DisplayNameField from './DisplayNameField.component';
import {InputField} from '../../General/InputField/InputField.component';
import Message from '../../General/Message/Message.component';
import {ProfileLibraryInfo} from './ProfileLibraryInfo.component';
import '../../../Utils/dateInputPolyfill/date-input-polyfill';
import './profileform.component.scss';
import {isMobile} from 'react-device-detect';

const fieldExplanationData = require('./profileFormData.json');

export default class ProfileForm extends React.Component {
  static propTypes = {
    changeImageAction: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
    profileImageSrc: PropTypes.string.isRequired,
    submitState: PropTypes.string,
    submitProgress: PropTypes.number,
    submit: PropTypes.func.isRequired,
    phone: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
    email: PropTypes.string,
    favoriteLibrary: PropTypes.object.isRequired,
    searchAction: PropTypes.func.isRequired,
    searchElements: PropTypes.array.isRequired,
    librarySearchDisabled: PropTypes.bool,
    unselectLibraryFunction: PropTypes.func.isRequired,
    search: PropTypes.string,
    fullName: PropTypes.string,
    birthday: PropTypes.string,
    checkDisplayNameFunction: PropTypes.func.isRequired,
    displayNameExists: PropTypes.bool,
    hasFilledInProfile: PropTypes.bool
  };

  static defaultProps = {
    searchElements: [],
    librarySearchDisabled: false,
    submitProgress: 0,
    displayNameExists: false
  };

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
      loanerId: (props.favoriteLibrary || {}).loanerId || '',
      pincode: (props.favoriteLibrary || {}).pincode || '',
      displayModal: false,
      fieldExplanation: {title: '', content: ''}
    };

    this.descriptionRef = null;
    this.profileFormRef = null;
  }

  componentDidMount() {
    autosize(this.descriptionRef);

    const elem = this.profileFormRef;
    elem.onsubmit = e => {
      const birthday = !isEmpty(this.state.birthday) ? dateformat(this.state.birthday, 'yyyy-mm-dd') : '';
      this.props.submit(
        e,
        sanitizeHtml(this.state.displayName),
        this.state.email,
        this.state.phone,
        this.state.libraryId,
        this.state.loanerId,
        this.state.pincode,
        sanitizeHtml(this.state.description),
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
        return <ProgressBar completed={this.props.submitProgress} height={'43px'} />;
      }
      case 'UPLOAD_COMPLETE': {
        return (
          <ProgressBar completed={this.props.submitProgress} height={'43px'}>
            <p className="progressbar--message">Behandler</p>
          </ProgressBar>
        );
      }
      case 'SUBMITTED': {
        return <RoundedButtonSubmit buttonText="GEMT" />;
      }
      default: {
        return (
          <RoundedButtonSubmit
            buttonText={this.props.hasFilledInProfile ? 'Gem min profil' : 'Opret min profil på Biblo.dk'}
          />
        );
      }
    }
  }
  hideShowModal(fieldExplanation) {
    this.setState({displayModal: !this.state.displayModal});
    if (fieldExplanation) {
      this.setState({fieldExplanation});
    }
  }
  renderFieldExplanation(fieldExplanation) {
    if (this.state.fieldExplanation) {
      return (
        <div>
          <p className="fieldExplanation required" onClick={() => this.hideShowModal(fieldExplanation)}>
            {isMobile ? 'Hvorfor?' : fieldExplanation.title}
          </p>
          {this.state.displayModal && (
            <ModalWindow onClose={this.hideShowModal.bind(this)}>
              <div className="cookie-warning">
                <div className="cookie-warning--svg" />
                <span className="cookie-warning--header">{this.state.fieldExplanation.modalTitle}</span>
                <span className="cookie-warning--message">{this.state.fieldExplanation.content}</span>
                <RoundedButton buttonText="OK" clickFunction={this.hideShowModal.bind(this)} />
              </div>
            </ModalWindow>
          )}
        </div>
      );
    }
    return;
  }

  render() {
    const errorObj = {};
    this.props.errors.forEach(error => {
      errorObj[error.field] = (
        <Message type="error">
          <span className={error.field}>{error.errorMessage}</span>
        </Message>
      );
    });

    const disabled = !!(this.props.submitState === 'SUBMITTING' || this.props.submitState === 'UPLOAD_COMPLETE');
    const submitArea = this.renderSubmitArea(this.props.submitState);
    const birthday = !isEmpty(this.props.birthday) ? dateformat(this.props.birthday, 'yyyy-mm-dd') : '';

    return (
      <div className={(this.props.errors.length > 0 && ' shakeit') || ''}>
        <div className={'profile-form' + ((this.props.errors.length > 0 && '') || '')}>
          <form
            method="POST"
            encType="multipart/form-data"
            id="profile_form_component"
            ref={profileForm => {
              this.profileFormRef = profileForm;
            }}
          >
            <div className="profile-image-upload">
              <DroppableImageField
                disabled={disabled}
                imageSrc={this.props.profileImageSrc}
                onFile={this.props.changeImageAction}
                fieldName={'profile_image'}
                overlayText={this.props.profileImageSrc === '/no_profile.png' ? 'Upload dit billede' : ''}
              />

              <div className="image-field-text-container">
                {this.renderFieldExplanation(fieldExplanationData.profileImage)}
              </div>
              {errorObj.profile_image || ''}
            </div>

            {errorObj.general || ''}

            <div className="padded-area">
              <span className="profile-form-headers">
                Disse to felter <u>skal</u> du udfylde:
              </span>
              <div>
                <DisplayNameField
                  value={this.state.displayName ? this.state.displayName : ''}
                  errors={errorObj}
                  onChangeFunc={e => this.setState({displayName: e.target.value})}
                  checkDisplayNameFunction={this.props.checkDisplayNameFunction}
                  displayNameExists={this.props.displayNameExists}
                  renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.username)}
                />
              </div>

              <ProfileLibraryInfo
                errorObj={errorObj}
                favoriteLibrary={this.props.favoriteLibrary}
                unselectLibraryFunction={this.props.unselectLibraryFunction}
                search={this.props.search}
                searchAction={this.props.searchAction}
                searchElements={this.props.searchElements}
                libraryId={this.state.libraryId}
                renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.library)}
              />
              <h1 className="profile-form-headers">
                Disse fem felter <u>behøver</u> du ikke at udfylde nu:
              </h1>

              <InputField
                defaultValue={this.props.fullName}
                error={errorObj.fullName}
                onChangeFunc={e => this.setState({fullName: e.target.value})}
                type="text"
                name="fullName"
                title="Dit rigtige navn"
                placeholder="Dit navn"
                renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.name)}
              />
              <InputField
                defaultValue={this.props.phone}
                error={errorObj.phone}
                onChangeFunc={e => this.setState({phone: e.target.value})}
                type="tel"
                name="phone"
                title="Mobil (din eller dine forældres)"
                placeholder="Mobil"
                renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.phone)}
              />
              <InputField
                defaultValue={this.props.email}
                error={errorObj.email}
                onChangeFunc={e => this.setState({email: e.target.value})}
                type="email"
                name="email"
                title="E-mail (din eller dine forældres)"
                placeholder="E-mail"
                renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.email)}
              />

              <InputField
                defaultValue={birthday}
                error={errorObj.birthday}
                onChangeFunc={e => this.setState({birthday: e.target.value})}
                type="date"
                name="birthday"
                title="Det år du blev født"
                placeholder="Vælg dit fødselsår"
                format="dd/mm/yyyy"
                data-date-format="dd/mm/yyyy"
                renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.born)}
              />

              <div className="description--form-area">
                <div className="inputFieldTextContainer">
                  <p>
                    <strong>Beskriv dig selv</strong>
                  </p>
                  {this.renderFieldExplanation(fieldExplanationData.description)}
                </div>
                <label>
                  <textarea
                    placeholder="Her kan du skrive lidt om dig selv"
                    name="description"
                    value={this.state.description ? this.state.description : ''}
                    ref={description => {
                      this.descriptionRef = description;
                    }}
                    onChange={e => this.setState({description: e.target.value})}
                  />
                  {errorObj.description || ''}
                </label>
              </div>

              <div className={'profile-form-submit-button'}>{submitArea}</div>
              <div className="profile-form--required-fields-description">
                <a target="_blank" rel="noopener noreferrer" href="https://biblo.dk/sikkerhed-pa-biblo">
                  Her kan du læse mere om hvordan vi passer på dine data på biblo.dk
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
