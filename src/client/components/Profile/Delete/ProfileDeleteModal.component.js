import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import spinnerSvg from '../../General/Icon/svg/spinners/loading-spin.svg';
import Icon from '../../General/Icon/Icon.component';
export default class ProfileDeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transfer: false
    };
  }
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isDeleted: PropTypes.bool,
    isDeleting: PropTypes.bool,
    hasError: PropTypes.bool
  };

  closeModalWindow = () => {
    if (!this.props.isDeleting) {
      this.props.onClose();
    }
  };
  confirmDelete = () => {
    this.props.onConfirm({transferGroups: this.state.transfer});
  };
  toggleTransfer = () => {
    this.setState({transfer: !this.state.transfer});
  };
  render() {
    if (this.props.hasError) {
      return (
        <ModalWindow onClose={this.closeModalWindow} title="Slet Profil">
          <h3 className="danger">Der er sket en fejl</h3>
          <p>
            Vi kan desværre ikke slette din profil. Prøv igen senere eller
            kontakt <a href="https://kundeservice.dbc.dk/biblo">kundeservice</a>
          </p>
          <div className="btn-wrapper">
            <button
              className="rounded-button rounded-button--secondary"
              onClick={this.closeModalWindow}
            >
              Luk
            </button>
          </div>
        </ModalWindow>
      );
    }

    if (this.props.isDeleted) {
      return (
        <ModalWindow onClose={this.closeModalWindow} title="Slet Profil">
          <h3 className="danger">Din profil er dit data er nu slettet</h3>
          <p>
            Vi håber at du vender tilbage en dag. Klik på log ud og luk din
            browser for at logge ud af UNI-login.
          </p>
          <div className="btn-wrapper">
            <a
              className="rounded-button rounded-button--secondary"
              href="/logout"
            >
              Log ud
            </a>
          </div>
        </ModalWindow>
      );
    }
    return (
      <ModalWindow onClose={this.closeModalWindow} title="Slet Profil">
        <h3 className="danger">Er du sikker på at du vil slette din profil?</h3>
        <p>
          Alle dine grupper, indlæg, kommentarer og anmeldelser vil blive
          slettet, og det vil ikke være muligt at dem tilbage
        </p>
        <div className="delete-modal--transfer">
          <input
            disabled={this.props.isDeleting}
            type="checkbox"
            name="transfer"
            id="transfer"
            checked={this.state.transfer}
            onClick={this.toggleTransfer}
          />{' '}
          <label htmlFor="transfer">
            Overfør mine grupper til en moderator.
          </label>
          <div className="delete-modal--note">
            Dine indlæg og kommentarer i grupperne vil stadig blive slettet.
          </div>
        </div>
        <div className="btn-wrapper">
          <button
            disabled={this.props.isDeleting}
            className="rounded-button rounded-button--secondary"
            onClick={this.closeModalWindow}
          >
            Nej tak, det var en fejl!
          </button>
          <button
            disabled={this.props.isDeleting}
            className="rounded-button rounded-button--danger"
            onClick={this.confirmDelete}
          >
            {this.props.isDeleting ? <Icon glyph={spinnerSvg} /> : ''}
            Ja tak, Slet min profil og alt mit data
          </button>
        </div>
      </ModalWindow>
    );
  }
}
