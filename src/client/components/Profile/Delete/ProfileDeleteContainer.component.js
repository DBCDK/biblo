import React from 'react';
import ModalWindow from './ProfileDeleteModal.component';
import './ProfileStyling.scss';

export default class ProfileDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
  }
  openConfirmDeleteModal = e => {
    e.preventDefault();
    this.setState({modalIsOpen: true});
  };
  onClose = () => {
    this.setState({modalIsOpen: false});
  };
  render() {
    return (
      <div>
        {this.state.modalIsOpen ? <ModalWindow onClose={this.onClose} /> : ''}
        <a href="#delete" onClick={this.openConfirmDeleteModal}>
          Slet profil
        </a>
      </div>
    );
  }
}
