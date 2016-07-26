import React from 'react';

import MessageRow from './MessageRow.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';

export default class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 15
    };
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

    const renderedMessages = messages.slice(0, this.state.limit).map(msg => {
      return (
        <MessageRow
          agencies={this.props.agencies}
          agencyActions={this.props.agencyActions}
          groupActions={this.props.groupActions}
          groupState={this.props.groupState}
          key={msg.createdEpoch}
          message={msg}
          readAction={this.props.readAction}
          deleteAction={this.props.deleteAction}
        />
      );
    });

    return (renderedMessages.length ? renderedMessages : 'Du har ingen beskeder');
  }

  onClickShowMore() {
    const state = Object.assign({}, this.state);
    this.setState({limit: state.limit + 15});
  }

  render() {
    const showMoreButton = this.props.messages.length > this.state.limit ?
      <VisFlereButton onClick={this.onClickShowMore.bind(this)} /> : null;

    return (
      <div className="p-detail--messages-container" >
           {this.getMessages()}
           {showMoreButton}
      </div>
    );
  }
}

MessagesContainer.displayName = 'MessagesContainer';
MessagesContainer.propTypes = {
  agencies: React.PropTypes.object.isRequired,
  agencyActions: React.PropTypes.object.isRequired,
  groupActions: React.PropTypes.object.isRequired,
  groupState: React.PropTypes.object.isRequired,
  messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  readAction: React.PropTypes.func.isRequired,
  deleteAction: React.PropTypes.func.isRequired
};
