import React from 'react';
import moment from 'moment';
import VisibilitySensor from 'react-visibility-sensor';

import Icon from '../../General/Icon/Icon.component';

// SVG
import klarSVG from '../../General/Icon/svg/functions/klar-til-afhentning.svg';
import backSVG from '../../General/Icon/svg/functions/back.svg';
import boedeSVG from '../../General/Icon/svg/functions/boede.svg';
import forSentSVG from '../../General/Icon/svg/functions/for-sent.svg';

import './scss/MessageRow.container.scss';

export default class MessageRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: this.props.message,
      justRead: false
    };
  }

  componentDidMount() {
    if (this.state.message.pickupAgency) {
      this.props.agencyActions.asyncGetLibraryDetailsAction({agencyId: this.state.message.pickupAgency});
    }
  }

  /**
   * Callback for react-visibility-sensor used when the sensor detects changes
   * in visiblity of the component.
   *
   * If isVisible is true this.props.readAction will be invoked.
   *
   * @param {boolean} isVisible
   */
  onVisibilityChanged(isVisible) {
    if (isVisible) {
      const message = Object.assign({}, this.state.message);

      this.setState({justRead: true});
      this.props.readAction(message);
    }
  }

  getMessageType() {
    switch (this.props.message.type) {
      case 'type-orderExpiresSoon':
        let glyph = backSVG;
        let text = 'Afleveres snart';
        let orderExpiresSoonClass = '';

        if (moment(this.state.message.dateDue).diff() < 0) {
          glyph = forSentSVG;
          text = 'Afleveret for sent';
          orderExpiresSoonClass = 'late';
        }

        return (
          <span className={orderExpiresSoonClass} >
            <Icon icon="profile" width={15} height={15} glyph={glyph} />
            {text}
          </span>
        );

      case 'type-orderIsReady':
        const orderReadyClass = this.state.message.ready ? 'ready' : '';

        return (
          <span className={orderReadyClass} >
            <Icon icon="klar-til-afhentning" width={15} height={15} glyph={klarSVG} />
            Klar til afhentning
          </span>
        );

      case 'Fine':
        return (
          <span className="boede" >
            <Icon icon="boede" width={15} height={15} glyph={boedeSVG} />
            Bøde
          </span>
        );

      case 'Reservation Charge':
        return (
          <span className="boede" >
            <Icon icon="boede" width={15} height={15} glyph={boedeSVG} />
            Reservations gebyr
          </span>
        );
      default:
        return this.props.message.type;
    }
  }

  getMessageContent() {
    switch (this.state.message.type) {
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

      case 'Fine':
        const boedeString = moment(this.state.message.date).fromNow();
        const amount = this.state.message.amount;

        return (
          <div>
            <div>{`Skulle have været afleveret for ${boedeString}`}</div>
            <div>{`Du skylder biblioteket ${amount} kr for at aflevere for sent`}</div>
          </div>
        );

      case 'Reservation Charge':
        const charge = this.state.message.amount;

        return (
          <div>
            <div>{`Reservationsgebyr: ${charge} kr`}</div>
          </div>
        );

      default:
        return this.props.message.type;
    }
  }

  getMessageImage() {
    const imageBasePath = '/images/messages';

    switch (this.state.message.type) {
      case 'type-orderExpiresSoon':
        return `${imageBasePath}/default-afleveres.png`;
      case 'type-orderIsReady':
        return `${imageBasePath}/default-afhentes.png`;
      case 'Fine':
      case 'Reservation Charge':
        return `${imageBasePath}/default-boede.png`;
      default:
        return '/images/covers/other.png';
    }
  }

  render() {
    moment.locale('da');

    const containerClass = !this.state.message.read ? 'message-row--container unread' : 'message-row--container';
    const justReadClass = this.state.justRead ? ' read' : '';
    const statusIndicator = !this.state.message.read ? '·' : '';

    const visibilitySenstorActive = (!this.state.justRead && !this.state.message.read);

    return (
      <VisibilitySensor onChange={this.onVisibilityChanged.bind(this)} delay={5000} active={visibilitySenstorActive} >
        <div className={`${containerClass} ${justReadClass}`} >
          <div className="message-row--status-container" >
            <div className="message-row--status" >
              {statusIndicator}
            </div>
          </div>
          <div className="message-row--image-container" >
            <img src={this.getMessageImage()} alt="Cover Image" />
          </div>
          <div className="message-row--data-container" >
            <div className="message-row--message-type" >{this.getMessageType()}</div>
            <div className="message-row--age" >{moment.utc(this.state.message.createdEpoch).fromNow()}</div>

            <div className="message-data--headline" >{this.state.message.title}</div>
            <div className="message-data--message-content" >{this.getMessageContent()}</div>
          </div>
        </div>
      </VisibilitySensor>
    );
  }
}

MessageRow.displayName = 'MessageRow';
MessageRow.propTypes = {
  agencies: React.PropTypes.object.isRequired,
  agencyActions: React.PropTypes.object.isRequired,
  message: React.PropTypes.object.isRequired,
  readAction: React.PropTypes.func.isRequired
};
