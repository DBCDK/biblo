import React from 'react';
import PropTypes from 'prop-types';
import {InputField} from '../../General/InputField/InputField.component';
import ConfirmDialog from '../../General/ConfirmDialog/ConfirmDialog.component.js';
import Message from '../../General/Message/Message.component';
import '../../Profile/Edit/profileform.component.scss';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ProfileActions from '../../../Actions/profile.actions';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import './contact-form.scss';

const fieldExplanationData = require('../../Profile/Edit/profileFormData.json');

class ContactForm extends React.Component {
  constructor() {
    super();
    this.state = {
      phone: null,
      email: null,
      userInCampaign: false,
      fieldExplanation: {title: '', content: ''},
      displayFieldExplanation: false,
      cancelled: false
    };
  }

  componentDidUpdate() {
    if (!this.state.userInCampaign) {
      this.setState({userInCampaign: true});
    }
  }

  profileEditSubmit(event) {
    const actions = this.props.actions;
    const profile = this.props.profile;
    const phone = this.state.phone && this.state.phone.length !== 0 ? this.state.phone : profile.phone;
    const email = this.state.email && this.state.email.length !== 0 ? this.state.email : profile.email;

    try {
      event.preventDefault();

      actions.asyncProfileEditSubmit(
        profile.imageFile,
        profile.displayName,
        email || profile.email,
        phone,
        profile.favoriteLibrary.libraryId,
        profile.loanerId,
        profile.pincode,
        profile.description,
        profile.birthday,
        profile.fullName,
        {
          preventRedirect: true,
          formLocation: '/profil/rediger'
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
  hideShowModal(fieldExplanation) {
    this.setState({displayFieldExplanation: !this.state.displayFieldExplanation});
    if (fieldExplanation) {
      this.setState({fieldExplanation});
    }
  }
  renderFieldExplanation(fieldExplanation) {
    const isMobile = window.innerWidth <= 500;

    return (
      <div>
        <p className="fieldExplanation required" onClick={() => this.hideShowModal(fieldExplanation)}>
          {isMobile ? 'Hvorfor?' : fieldExplanation.title}
        </p>
        {this.state.displayModal && <ModalWindow onClose={this.hideShowModal.bind(this)} />}
      </div>
    );
  }

  checkIfRequiredInfoIsFilled() {
    const profile = this.props.profile;
    switch (this.props.showInput) {
      case 'phone':
        return profile.phone && profile.phone.length !== 0;

      case 'mail':
        return profile.email && profile.email.length !== 0;
      case 'phoneOrMail':
        return (profile.email && profile.email.length !== 0) || (profile.phone && profile.phone.length !== 0);

      case 'phoneAndMail':
        return profile.email && profile.email.length !== 0 && (profile.phone && profile.phone.length !== 0);
      default:
        return;
    }
  }

  renderFieldExplanationContent() {
    return (
      <div className="cookie-warning">
        <div className="cookie-warning--svg" />
        <span className="cookie-warning--header">{this.state.fieldExplanation.modalTitle}</span>
        <span className="cookie-warning--message">{this.state.fieldExplanation.content}</span>
        <RoundedButton buttonText="OK" clickFunction={this.hideShowModal.bind(this)} />
      </div>
    );
  }

  renderInputFields() {
    const errors = this.props.profile.errors || [];
    const isMobile = window.innerWidth <= 500;

    const errorObj = {};
    errors.forEach(error => {
      errorObj[error.field] = (
        <Message type="error">
          <span className={error.field}>{error.errorMessage}</span>
        </Message>
      );
    });
    return (
      <React.Fragment>
        <div className="modal-window--borrow-container">
          <span className="contact-modal-window-header">Tak for at du vil være med!</span>
          <p>
            {` Skriv ${this.props.text} nedenfor for at deltage i konkurrencen. `}
            Så vi kan kontakte dig, hvis du vinder en præmie.
          </p>
        </div>

        {['phoneAndMail', 'phoneOrMail', 'phone'].includes(this.props.showInput) && (
          <InputField
            defaultValue={this.props.profile.phone || ''}
            error={errorObj.phone}
            onChangeFunc={e => this.setState({phone: e.target.value})}
            type="tel"
            name="phone"
            title={'Mobil' + (isMobile ? '' : ' (din eller dine forældres)')}
            placeholder="Mobil"
            renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.phone)}
          />
        )}
        {['phoneAndMail', 'phoneOrMail', 'mail'].includes(this.props.showInput) && (
          <InputField
            defaultValue={this.props.profile.email || ''}
            error={errorObj.email}
            onChangeFunc={e => this.setState({email: e.target.value})}
            type="email"
            name="email"
            title={'E-mail' + (isMobile ? '' : ' (din eller dine forældres)')}
            placeholder="E-mail"
            renderFieldExplanation={this.renderFieldExplanation(fieldExplanationData.email)}
          />
        )}
      </React.Fragment>
    );
  }
  render() {
    const requiredInfoIsFilled = this.checkIfRequiredInfoIsFilled();
    const modalContent = this.state.displayFieldExplanation
      ? this.renderFieldExplanationContent()
      : this.renderInputFields();
    if (this.state.cancelled) {
      return (
        <ConfirmDialog
          confirmButtonText="OK"
          cancelButtonText=""
          confirmFunc={() => {
            this.props.closeModalWindow();
          }}
          confirmButtonColor="#2acc94"
        >
          <div className="modal-window--borrow-container">
            <span className="contact-modal-window-header">Helt OK.</span>

            <p>
              {`Hvis du fortryder, kan du altid skrive ${this.props.text} på din profilside. `}
              Så har du stadig mulighed for at vinde præmier i vores konkurrencer.
            </p>
          </div>
        </ConfirmDialog>
      );
    }

    if (requiredInfoIsFilled) {
      return (
        <ConfirmDialog
          confirmButtonText="OK"
          cancelButtonText=""
          cancelFunc={() => {
            this.props.closeModalWindow();
          }}
          confirmFunc={() => {
            this.props.closeModalWindow();
          }}
          confirmButtonColor="#2acc94"
        >
          <div className="modal-window--borrow-container">
            <span className="contact-modal-window-header">Super!</span>

            <p>Nu er dine info gemt og du er med i konkurrencen.</p>
          </div>
        </ConfirmDialog>
      );
    }

    return (
      <ConfirmDialog
        cancelButtonText={this.state.displayFieldExplanation ? '' : 'Spring over'}
        confirmButtonText={this.state.displayFieldExplanation ? '' : 'Gem'}
        cancelFunc={() => {
          this.setState({cancelled: true});
        }}
        confirmFunc={this.profileEditSubmit.bind(this)}
        confirmButtonColor="#2acc94"
      >
        {modalContent}
      </ConfirmDialog>
    );
  }
}

ContactForm.propTypes = {
  showPhoneInput: PropTypes.bool,
  showMailInput: PropTypes.bool,
  text: PropTypes.string,
  profile: PropTypes.object,
  actions: PropTypes.object,
  closeModalWindow: PropTypes.func,
  showInput: PropTypes.oneOf(['phone', 'mail', 'phoneAndMail', 'phoneOrMail'])
};

ContactForm.defaultProps = {
  showPhoneInput: false,
  showMailInput: false
};

export default connect(
  // Map redux state to group prop
  state => {
    return {
      searchState: state.searchReducer,
      profile: state.profileReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  dispatch => {
    return {
      actions: bindActionCreators(ProfileActions, dispatch)
    };
  }
)(ContactForm);
