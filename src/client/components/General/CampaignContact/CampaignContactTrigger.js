import React from 'react';
import ContactForm from './ContactForm.component';

/**
 * This function most be bound to a component that contains the following props:
 * campaign: a campaign object
 * uiActions: UI actions (openModalWindow and closeModalWindow)
 * profile: current user profile
 */
export default function checkCampaignInfo() {
  if (this.props.campaign && this.props.profile && this.props.uiActions) {
    let dialog;
    const user = this.props.profile;
    switch (this.props.campaign.requiredContactInfo) {
      case 'phone':
        if (!user.phone || user.phone.length === 0) {
          dialog = (
            <ContactForm
              text={'dit mobilnummer'}
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
              text={'din email'}
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
              text={'dit mobilnummer og email'}
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
              text={'dit mobilnummer eller email'}
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
}
