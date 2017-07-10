import React from 'react';
import PropTypes from 'prop-types';

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
          renewLoanAction={this.props.renewLoanAction}
          userstatusState={this.props.userstatusState}
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
  agencies: PropTypes.object.isRequired,
  agencyActions: PropTypes.object.isRequired,
  groupActions: PropTypes.object.isRequired,
  groupState: PropTypes.object.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  readAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  renewLoanAction: PropTypes.func.isRequired,
  userstatusState: PropTypes.object.isRequired
};
