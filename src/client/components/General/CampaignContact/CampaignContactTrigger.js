import React from 'react';
import ContactForm from './ContactForm.component';

/**
 * This function most be bound to a component that contains the following props:
 * campaign: a campaign object
 * uiActions: UI actions (openModalWindow and closeModalWindow)
 * profile: current user profile
 */
export default function checkCampaignInfo() {
  let dialog;
  const user = this.props.profile;
  switch (this.props.campaign.requiredContactInfo) {
    case 'phone':
      if (!user.phone || user.phone.length === 0) {
        dialog = (
          <ContactForm
            text={'telefonnummer'}
            closeModalWindow={this.props.uiActions.closeModalWindow}
            showInput={this.props.campaign.requiredContactInfo}
          />
        );
        this.props.uiActions.openModalWindow(dialog);
      }
      break;
    case 'mail':
      if (!user.email || user.email.length === 0) {
        dialog = (
          <ContactForm
            text={'email'}
            closeModalWindow={this.props.uiActions.closeModalWindow}
            showInput={this.props.campaign.requiredContactInfo}
          />
        );
        this.props.uiActions.openModalWindow(dialog);
      }
      break;
    case 'phoneAndMail':
      if (!user.email || user.email.length === 0 || (!user.phone || user.phone.length === 0)) {
        dialog = (
          <ContactForm
            text={'telefon og email'}
            closeModalWindow={this.props.uiActions.closeModalWindow}
            showInput={this.props.campaign.requiredContactInfo}
          />
        );
        this.props.uiActions.openModalWindow(dialog);
      }
      break;
    case 'phoneOrMail':
      if ((!user.email || user.email.length === 0) && (!user.phone || user.phone.length === 0)) {
        dialog = (
          <ContactForm
            text={'telefon eller email'}
            closeModalWindow={this.props.uiActions.closeModalWindow}
            showInput={this.props.campaign.requiredContactInfo}
          />
        );
        this.props.uiActions.openModalWindow(dialog);
      }
      break;

    default:
  }
}
