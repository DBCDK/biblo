import React from 'react';
import moment from 'moment';

import Icon from '../../General/Icon/Icon.component';
import klarSVG from '../../General/Icon/svg/functions/klar-til-afhentning.svg';
import backSVG from '../../General/Icon/svg/functions/back.svg';

import './scss/MessageRow.container.scss';

export default class MessageRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: this.props.message
    };
  }

  componentDidMount() {
    if (this.state.message.pickupAgency) {
      this.props.agencyActions.asyncGetLibraryDetailsAction({agencyId: this.state.message.pickupAgency});
    }
  }
/*
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
*/
  getMessageType() {
    switch (this.props.message.type) {
      case 'Fine':
        return 'Dummebøde';
      case 'Reservation Charge':
        return 'Reservation Charge';
      case 'type-orderExpiresSoon':
        return (
          <span>
            <Icon icon="profile" width={15} height={15} glyph={backSVG} />
            Afleveres snart
          </span>
        );
      case 'type-orderIsReady':
        return (
          <span>
            <Icon icon="profile" width={15} height={15} glyph={klarSVG} />
            Klar til afhentning
          </span>
        );
      default:
        return this.props.message.type;
    }
  }

  getMessageContent() {
    switch (this.state.message.type) {
      case 'Fine':
        return 'Dummebøde';
      case 'Reservation Charge':
        return 'Reservation Charge';
      case 'type-orderExpiresSoon':
        const diff = moment(this.state.message.dateDue).diff();
        const dateString = moment(this.state.message.dateDue).fromNow();
        const string = diff < 0 ? 'Skulle være afleveret for' : 'Skal afleveres om senest';
        return (<span>{string} {dateString}</span>);
      case 'type-orderIsReady':
        const agency = this.props.agencies[this.state.message.pickupAgency];
        let branchName = 'Ukendt bibliotek';
        if (agency) {
          branchName = agency.branchName.$value;
        }
        const pickUpDateString = moment(this.state.message.pickupExpires).format('LL');
        return (
          <div>
            <div>Ligger klar til dig på {branchName}</div>
            <div>Husk at hente den senest {pickUpDateString}</div>
          </div>
        );
      default:
        return this.props.message.type;
    }
  }

  render() {
    moment.locale('da');

    const containerClass = !this.state.message.read ? 'message-row--container unread' : 'message-row--container';
    const messageTypeClass = this.state.message.ready ? 'message-row--message-type ready' : 'message-row--message-type';
    const statusIndicator = !this.state.message.read ? '·' : '';

    return (
      <div className={containerClass} >
        <div className="message-row--status-container" >
          <div className="message-row--status" >
            {statusIndicator}
          </div>
        </div>
        <div className="message-row--image-container" >
          <img src="/images/covers/other.png" alt="Cover Image" />
        </div>
        <div className="message-row--data-container" >
          <div className={messageTypeClass} >{this.getMessageType()}</div>
          <div className="message-row--age" >{moment.utc(this.state.message.createdEpoch).fromNow()}</div>

          <div className="message-data--headline" >{this.state.message.title}</div>
          <div className="message-data--message-content" >{this.getMessageContent()}</div>
        </div>
      </div>
    );
  }
}

MessageRow.displayName = 'MessageRow';
MessageRow.propTypes = {
  agencies: React.PropTypes.object.isRequired,
  agencyActions: React.PropTypes.object.isRequired,
  message: React.PropTypes.object.isRequired,
  readAction: React.PropTypes.func
};

MessageRow.defaultProps = {
  readAction: () => {
    console.error('Using default readAction as no action was provided to component through props'); // eslint-disable-line no-console
  }
};
