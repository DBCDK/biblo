import React from 'react';
import PropTypes from 'prop-types';

// Components
import ModalWindow from '../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';

// Styling
import './scss/message-modal.scss';

export default class ModeratorMessageModal extends React.Component {
  constructor() {
    super();

    this.state = {
      isClient: false,
      displayMessage: false,
      unreadMessages: []
    };
  }

  componentDidMount() {
    this.checkForUnreadMessages();
    this.setState({isClient: true});
  }

  componentDidUpdate() {
    if (!this.state.displayMessage) {
      this.checkForUnreadMessages();
    }
  }
  checkForUnreadMessages() {
    // get userMessages from profileState and check for new unread messages from moderator
    const userMessages = this.props.profileState.userMessages;
    let unreadMessages = [];
    if (userMessages && userMessages.unreadMessages > 0) {
      userMessages.messages.map(msg => {
        if (!msg.read && (msg.type === 'type-messageFromAdmin' || msg.type === 'type-userWasQuarantined')) {
          unreadMessages.push(msg);
        }
      });
      this.setState({displayMessage: true, unreadMessages});
    }
  }

  onClose() {
    const displayedMessage = this.state.unreadMessages[0];
    this.props.profileActions.asyncMarkUserMessageAsRead(displayedMessage);

    let unreadMessages = this.state.unreadMessages;
    unreadMessages.shift();
    this.setState({displayMessage: unreadMessages.length > 0, unreadMessages});
  }

  render() {
    const message = this.state.unreadMessages[0];

    return this.state.displayMessage && this.state.isClient && message ? (
      <ModalWindow onClose={this.onClose.bind(this)}>
        <div className="message-modal">
          <span className="message-modal-window-header">
            {message.type === 'type-messageFromAdmin'
              ? 'Du har fået en ny besked fra moderator!'
              : 'Du har fået en karantæne..'}
          </span>
          <span>{message.reason || message.message}</span>
          <RoundedButton buttonText="OK" clickFunction={this.onClose.bind(this)} />
        </div>
      </ModalWindow>
    ) : null;
  }
}

ModeratorMessageModal.defaultProps = {
  profileState: {
    userMessages: {}
  }
};

ModeratorMessageModal.propTypes = {
  profileState: PropTypes.object.isRequired,
  profileActions: PropTypes.object.isRequired
};
