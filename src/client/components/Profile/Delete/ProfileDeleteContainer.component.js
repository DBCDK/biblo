import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from './ProfileDeleteModal.component';
import './ProfileDeleteStyling.scss';

export default class ProfileDelete extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
  };

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

  onConfirm = ({transferGroups}) => {
    this.props.onDelete({profile: this.props.profile, transferGroups});
  };

  render() {
    return (
      <div>
        {this.state.modalIsOpen ? (
          <ModalWindow
            onClose={this.onClose}
            onConfirm={this.onConfirm}
            isDeleted={this.props.profile.UI.isDeleted}
            isDeleting={this.props.profile.UI.isDeleting}
            hasError={this.props.profile.UI.hasDeleteError}
          />
        ) : (
          ''
        )}
        <div className="delete--link">
          <a href="#delete" onClick={this.openConfirmDeleteModal}>
            Slet profil
          </a>
        </div>
      </div>
    );
  }
}
