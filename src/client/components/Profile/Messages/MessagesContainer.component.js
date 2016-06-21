import React from 'react';

import MessageRow from './MessageRow.component';

export default class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  sortMessages() {
    return this.props.messages.sort((a, b) => {
      if (a.createdEpoch < b.createdEpoch) {
        return 1;
      }
      if (a.createdEpoch > b.createdEpoch) {
        return -1;
      }
      return 0;
    });
  }

  getMessages() {
    const messages = this.sortMessages();

    const renderedMessages = messages.map((msg, index) => {
      return (
        <MessageRow
          agencies={this.props.agencies}
          agencyActions={this.props.agencyActions}
          message={msg}
          readAction={this.props.readAction}
          key={index}
        />
      );
    });

    return (
      <div className="p-detail--messages-container" >
        {renderedMessages.length ? renderedMessages : 'Du har ingen beskeder'}
      </div>
    );
  }

  render() {
    return (
      <div>{this.getMessages()}</div>
    );
  }
}

MessagesContainer.displayName = 'MessagesContainer';
MessagesContainer.propTypes = {
  agencies: React.PropTypes.object.isRequired,
  agencyActions: React.PropTypes.object.isRequired,
  messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  readAction: React.PropTypes.func.isRequired
};
