import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import spinnerSvg from '../../General/Icon/svg/spinners/loading-spin.svg';
import Icon from '../../General/Icon/Icon.component';
export default class ProfileDeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transfer: true,
      hasConfirmedDelete: false
    };
  }
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    imageUrl: PropTypes.string.isRequired,
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
          <h1 className="danger">Der er sket en fejl</h1>
          <p>
            Vi kan desværre ikke slette din profil. Prøv igen senere eller kontakt{' '}
            <a href="https://kundeservice.dbc.dk/biblo">kundeservice</a>
          </p>
          <div className="btn-wrapper">
            <button className="rounded-button rounded-button--secondary" onClick={this.closeModalWindow}>
              Luk
            </button>
          </div>
        </ModalWindow>
      );
    }

    if (this.props.isDeleted) {
      return (
        <ModalWindow
          onClose={() => {
            window.location = '/logout';
          }}
          title="Slet Profil"
        >
          <div className="delete-modal">
            <h1 className="danger">Din profil er nu slettet</h1>
            <p>Vi håber at du vender tilbage en dag. Klik på log ud og luk din browser for at logge ud af UNI-login.</p>
            <div className="btn-wrapper">
              <a className="rounded-button rounded-button--secondary" href="/logout">
                Log ud
              </a>
            </div>
          </div>
        </ModalWindow>
      );
    }

    if (this.state.hasConfirmedDelete) {
      return (
        <ModalWindow onClose={this.closeModalWindow} title="Slet Profil">
          <div className="delete-modal">
            <h1 className="danger">Hvis du giver dine grupper videre, kan andre få glæde af dem</h1>
            <p>
              Din profil, dine indlæg, kommentarer og anmeldelser bliver slettet. Men måske vil andre gerne bruge de
              grupper, du har oprettet. Skal Biblo passe dem for dig?
            </p>
            <div className="delete-modal--transfer">
              <h4>Hvad skal vi gøre med dine grupper?</h4>
              <p className="delete-modal--radio">
                <input
                  disabled={this.props.isDeleting}
                  type="radio"
                  name="transfer"
                  id="transfer"
                  checked={this.state.transfer}
                  onClick={this.toggleTransfer}
                />{' '}
                <label htmlFor="transfer">
                  Slet min profil og alt jeg har lavet på Biblo,{' '}
                  <span className="delete-modal--info">
                    men giv mine grupper videre til en voksen fra Biblo, så andre stadig kan bruge grupperne.
                  </span>
                </label>
              </p>
              <p className="delete-modal--radio">
                <input
                  disabled={this.props.isDeleting}
                  type="radio"
                  name="transfer"
                  id="no-transfer"
                  checked={!this.state.transfer}
                  onClick={this.toggleTransfer}
                />{' '}
                <label htmlFor="no-transfer">Slet min profil og alt jeg har lavet på Biblo</label>
              </p>
            </div>
            <div className="delete-modal--btn-wrapper">
              <button
                disabled={this.props.isDeleting}
                className="rounded-button rounded-button--secondary"
                onClick={this.closeModalWindow}
              >
                Stop! Slet ikke min profil
              </button>
              <button
                disabled={this.props.isDeleting}
                className="rounded-button rounded-button--danger"
                onClick={this.confirmDelete}
              >
                {this.props.isDeleting ? <Icon glyph={spinnerSvg} /> : ''}
                Slet min profil
              </button>
            </div>
          </div>
        </ModalWindow>
      );
    }

    return (
      <ModalWindow onClose={this.closeModalWindow} title="Slet Profil">
        <div className="delete-modal">
          <div className="delete-modal--image">
            <img src={this.props.imageUrl} />
            <span className="delete-modal--mark" />
          </div>

          <h1 className="danger">Du er ved at slette din profil</h1>
          <p>Hvis du sletter din profil, sletter du alt, hvad du har lavet på Biblo.</p>
          <p>Du kan altså ikke få din profil tilbage, men du kan altid oprette en ny profil på et andet tidspunkt.</p>
          <div className="delete-modal--btn-wrapper">
            <button className="rounded-button rounded-button--secondary" onClick={this.closeModalWindow}>
              Stop! Slet ikke min profil
            </button>
            <button
              className="rounded-button rounded-button--danger"
              onClick={() => this.setState({hasConfirmedDelete: true})}
            >
              Slet min profil
            </button>
          </div>
        </div>
      </ModalWindow>
    );
  }
}
