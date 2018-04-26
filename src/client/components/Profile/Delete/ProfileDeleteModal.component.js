import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
export default class ProfileDeleteModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired
  };

  closeModalWindow = () => {
    this.props.onClose();
  };
  confirmDelete = () => {};
  render() {
    return (
      <ModalWindow onClose={this.closeModalWindow} title="Slet Profil">
        <h3 className="danger">Er du sikker på at du vil slette din profil?</h3>
        <p>
          Alle dine grupper, indlæg, kommentarer og anmeldelser vil blive
          slettet, og det vil ikke være muligt at dem tilbage
        </p>
        <div className="delete-modal--transfer">
          <input type="checkbox" name="transfer" id="transfer" />{' '}
          <label htmlFor="transfer">
            Overfør mine grupper til en moderator.
          </label>
          <div className="delete-modal--note">Dine indlæg og kommentarer i
            grupperne vil stadig blive slettet.</div>
        </div>
        <div className="btn-wrapper">
          <button
            className="rounded-button rounded-button--secondary"
            onClick={this.closeModalWindow}
          >
            Nej tak, det var en fejl!
          </button>
          <button
            className="rounded-button rounded-button--danger"
            onClick={this.confirmDelete}
          >
            Ja tak, Slet min profil og alt mit data
          </button>
        </div>
      </ModalWindow>
    );
  }
}
