import React from 'react';
import PropTypes from 'prop-types';
import {InputField} from '../../General/InputField/InputField.component';
import ConfirmDialog from '../../General/ConfirmDialog/ConfirmDialog.component.js';
import Message from '../../General/Message/Message.component';
import {isMobile} from 'react-device-detect';
import './profileform.component.scss';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ProfileActions from '../../../Actions/profile.actions';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';

class ContactForm extends React.Component {
  constructor() {
    super();
    this.state = {
      phone: null,
      email: null,
      userInCampaign: false
    };
  }

  componentDidUpdate() {
    if (!this.state.userInCampaign) {
      this.setState({userInCampaign: true});
    }
  }

  profileEditSubmit = async event => {
    const actions = this.props.actions;
    const profile = this.props.profile;
    console.log('profile', profile);
    console.log('submit');
    const phone = this.state.phone && this.state.phone.length !== 0 ? this.state.phone : profile.phone;
    const email = this.state.email && this.state.email.length !== 0 ? this.state.email : profile.email;

    try {
      event.preventDefault();

      const res = await actions.asyncProfileEditSubmit(
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
      console.log('profile.erros', profile.errors);
      console.log('res', res);
      // this.props.closeModalWindow();
    } catch (error) {
      console.error(error);
    }
  };

  renderFieldExplanation(fieldExplanation) {
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

  checkIfRequiredInfoIsFilled() {
    const profile = this.props.profile;

    switch (this.props.showInput) {
      case 'phone':
        return profile.phone && profile.phone.length !== 0;

      case 'email':
        return profile.email && profile.email.length !== 0;
      case 'phoneOrMail':
        return (profile.email && profile.email.length !== 0) || (profile.phone && profile.phone.length !== 0);

      case 'phoneAndMail':
        return profile.email && profile.email.length !== 0 && (profile.phone && profile.phone.length !== 0);
      default:
        return;
    }
  }
  render() {
    // const profile = this.props.profile;
    const requiredInfoIsFilled = this.checkIfRequiredInfoIsFilled();

    if (requiredInfoIsFilled) {
      return (
        <ConfirmDialog
          confirmButtonText={'OK'}
          cancelFunc={() => {
            console.log('in cancelFunc. props', this.props);
            this.props.closeModalWindow();
          }}
          confirmFunc={() => {
            console.log('in cancelFunc. props', this.props);
            this.props.closeModalWindow();
          }}
          confirmButtonColor="#2acc94"
        >
          <div className="modal-window--borrow-container">
            <p>Tak. Du er med i kampagnen nu.</p>
          </div>
        </ConfirmDialog>
      );
    }

    console.log('state', this.state);
    console.log('CF this.props', this.props);
    const errors = this.props.profile.errors || [];

    const errorObj = {};
    errors.forEach(error => {
      errorObj[error.field] = (
        <Message type="error">
          <span className={error.field}>{error.errorMessage}</span>
        </Message>
      );
    });
    return (
      <ConfirmDialog
        cancelButtonText={'Fortryd'}
        confirmButtonText={'Gem'}
        cancelFunc={() => {
          console.log('in cancelFunc. props', this.props);
          this.props.closeModalWindow();
        }}
        confirmFunc={this.profileEditSubmit.bind(this)}
        confirmButtonColor="#2acc94"
      >
        <div className="modal-window--borrow-container">
          <p>{`Du skal angive ${this.props.text} for at deltage i kampagnen`}</p>
        </div>

        {['phoneAndMail', 'phoneOrMail', 'phone'].includes(this.props.showInput) && (
          <InputField
            defaultValue={this.props.profile.phone || ''}
            error={errorObj.phone}
            onChangeFunc={e => this.setState({phone: e.target.value})}
            type="tel"
            name="phone"
            title="Mobil (din eller dine forældres)"
            placeholder="Mobil"
          />
        )}
        {['phoneAndMail', 'phoneOrMail', 'email'].includes(this.props.showInput) && (
          <InputField
            defaultValue={this.props.profile.email || ''}
            error={errorObj.email}
            onChangeFunc={e => this.setState({email: e.target.value})}
            type="email"
            name="email"
            title="E-mail (din eller dine forældres)"
            placeholder="E-mail"
          />
        )}
      </ConfirmDialog>
    );
  }
}

ContactForm.propTypes = {
  showPhoneInput: PropTypes.bool,
  showMailInput: PropTypes.bool,
  text: PropTypes.string,
  profile: PropTypes.object,
  actions: PropTypes.func,
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
