import React from 'react';
import moment from 'moment';
import VisibilitySensor from 'react-visibility-sensor';

import Icon from '../../General/Icon/Icon.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';

// SVG
import klarSVG from '../../General/Icon/svg/functions/klar-til-afhentning.svg';
import backSVG from '../../General/Icon/svg/functions/back.svg';
import boedeSVG from '../../General/Icon/svg/functions/boede.svg';
import forSentSVG from '../../General/Icon/svg/functions/for-sent.svg';
import commentSVG from '../../General/Icon/svg/functions/comment.svg';
import closeSVG from '../../General/Icon/svg/functions/close.svg';
import moderatorProfileSVG from '../../General/Icon/svg/functions/moderator-profilbillede.svg';

import './scss/MessageRow.container.scss';

export default class MessageRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: this.props.message || {},
      comment: {},
      justRead: false
    };
  }

  componentDidMount() {
    if (this.state.message.pickupAgency) {
      this.props.agencyActions.asyncGetLibraryDetailsAction({agencyId: this.state.message.pickupAgency});
    }

    if (this.state.message.commentId) {
      this.props.groupActions.asyncGetSingleComment(this.state.message.commentId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupState.comments[this.state.message.commentId] && !Object.keys(this.state.comment).length) {
      const comment = nextProps.groupState.comments[this.state.message.commentId];
      this.setState({comment: comment});
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
      case 'type-orderExpiresSoon': {
        let glyph = backSVG;
        let text = 'Afleveres snart';
        let orderExpiresSoonClass = '';

        if (moment(this.state.message.dateDue).diff(moment(), 'days') < 0) {
          glyph = forSentSVG;
          text = 'Afleveret for sent';
          orderExpiresSoonClass = 'late';
        }

        return (
          <span className={orderExpiresSoonClass}>
            <Icon icon="profile" width={15} height={15} glyph={glyph}/>
            {text}
          </span>
        );
      }

      case 'type-orderIsReady': {
        const orderReadyClass = this.state.message.ready ? 'ready' : '';

        return (
          <span className={orderReadyClass}>
            <Icon icon="klar-til-afhentning" width={15} height={15} glyph={klarSVG}/>
            Klar til afhentning
          </span>
        );
      }

      case 'Fine': {
        return (
          <span className="boede">
            <Icon icon="boede" width={15} height={15} glyph={boedeSVG}/>
            Bøde
          </span>
        );
      }

      case 'Reservation Charge': {
        return (
          <span className="boede">
            <Icon icon="boede" width={15} height={15} glyph={boedeSVG}/>
            Reservations gebyr
          </span>
        );
      }

      case 'type-commentWasAdded': {
        const groupName = this.state.comment.post ? this.state.comment.post.group.name : '';
        const groupId = this.state.comment.post ? this.state.comment.post.group.id : '';

        return (
          <span className="kommentar">
            <Icon icon="kommentar" width={15} height={15} glyph={commentSVG}/>
            Ny kommentar til dit indlæg i <a href={`/grupper/${groupId}`}>{groupName}</a>
          </span>
        );
      }

      case 'type-userWasQuarantined': {
        return (
          <span className="quarantine">
            <Icon width={15} height={15} glyph={commentSVG}/>
            Ny besked fra moderator
          </span>
        );
      }

      default: {
        return this.props.message.type;
      }
    }
  }

  getMessageContent() {
    switch (this.state.message.type) {
      case 'type-orderExpiresSoon': {
        const diff = moment(this.state.message.dateDue).diff(moment(), 'days');
        const string = diff === 0 ? 'i dag' : (diff > 0 ? 'om ' : '') + Math.abs(diff).toString() + ' dag' + (Math.abs(diff) === 1 ? '' : 'e');
        const dateString = diff < 0 ? 'Skulle være afleveret for ' + string + ' siden' : 'Skal afleveres senest ' + string;

        return (<span>{dateString}</span>);
      }

      case 'type-orderIsReady': {
        const agency = this.props.agencies[this.state.message.pickupAgency] || {};
        const branchShortNames = agency.branchShortName || null;
        let branchName = 'Ukendt bibliotek';
        if (branchShortNames) {
          branchName = Array.isArray(branchShortNames) ? branchShortNames[0].$value : branchShortNames.$value;
        }

        const pickUpDateString = moment(this.state.message.pickupExpires).format('LL');

        return (
          <div>
            <div>Ligger klar til dig på {branchName}</div>
            <div>Husk at hente den senest {pickUpDateString}</div>
          </div>
        );
      }

      case 'Fine': {
        const boedeString = moment(this.state.message.date).fromNow();
        const amount = this.state.message.amount;

        return (
          <div>
            <div>{`Skulle have været afleveret for ${boedeString}`}</div>
            <div>{`Du skylder biblioteket ${amount} kr for at aflevere for sent`}</div>
          </div>
        );
      }

      case 'Reservation Charge': {
        const charge = this.state.message.amount;

        return (
          <div>
            <div>{`Reservationsgebyr: ${charge} kr`}</div>
          </div>
        );
      }

      case 'type-commentWasAdded': {
        const username = this.state.comment.owner ? this.state.comment.owner.raw.displayName : '';
        const ownerId = this.state.comment.commentownerid || '';
        const commentContent = this.state.comment.content || '';
        const commentImg = this.state.comment.image ?
          <img src={this.state.comment.image} alt={commentContent}/> : null;
        const groupId = this.state.comment.post ? this.state.comment.post.groupid : null;
        const postId = this.state.comment.commentcontainerpostid || null;

        return (
          <div>
            <div className="comment">
              <div className="comment-username"><a href={`/profil/${ownerId}`}>{username}</a></div>
              <div>{commentContent}</div>
              {commentImg}
            </div>
            <RoundedButton buttonText='Se alle kommentarer' href={`/grupper/${groupId}/${postId}`}/>
          </div>
        );
      }

      case 'type-userWasQuarantined': {
        const messageContent = this.state.message.reason;

        /* eslint-disable react/no-danger */
        return (
          <div className="quarantine">
            <div className="quarantine--author">Moderator</div>

            <div className="quarantine--message-content">
              <span dangerouslySetInnerHTML={{__html: messageContent}}/>
            </div>
          </div>
        );
        /* eslint-enable react/no-danger */
      }

      default: {
        return this.props.message.type;
      }
    }
  }

  /**
   * Returns the appropriate iamge depending on the messagetype
   * @return {*}
   */
  getMessageImage() {
    const imageBasePath = '/images/messages';

    switch (this.state.message.type) {

      case 'type-orderExpiresSoon': {
        return <img src={`${imageBasePath}/default-afleveres.png`} alt="Afleveres billede"/>;
      }

      case 'type-orderIsReady': {
        return <img src={`${imageBasePath}/default-afhentes.png`} alt="Afhentes billede"/>;
      }

      case 'Fine': {
        return <img src={`${imageBasePath}/default-boede.png`} alt="Bøde billede"/>;
      }

      case 'Reservation Charge': {
        return <img src={`${imageBasePath}/default-boede.png`} alt="Gebyr billede"/>;
      }

      case 'type-commentWasAdded': {
        const profileImage = this.state.comment.owner ? this.state.comment.owner.image : '/no_profile.png';

        return (
          <div className="profileimage">
            <img src={profileImage} alt="Profil billede"/>
          </div>
        );
      }

      case 'type-userWasQuarantined': {
        return (
          <div className="profileimage moderator">
            <Icon glyph={moderatorProfileSVG} height={70} width={70}/>
          </div>
        );
      }

      default: {
        return '/images/covers/other.png';
      }
    }
  }

  deleteMessageButton() {
    return (
      <TinyButton
        clickFunction={this.deleteMessage.bind(this)}
        icon={<Icon icon="close" glyph={closeSVG} width={15} height={15}/>}
      />
    );
  }

  deleteMessage() {
    this.props.deleteAction(this.state.message);
  }

  render() {
    moment.locale('da');

    const containerClass = !this.state.message.read ? 'message-row--container unread' : 'message-row--container';
    const justReadClass = this.state.justRead ? ' read' : '';
    const statusIndicator = !this.state.message.read ? '·' : '';

    const visibilitySenstorActive = (!this.state.justRead && !this.state.message.read);

    return (
      <VisibilitySensor onChange={this.onVisibilityChanged.bind(this)} delay={5000} active={visibilitySenstorActive}>
        <div className={`${containerClass} ${justReadClass}`}>
          <div className="message-row--status-container">

            <div className="message-row--status">
              {statusIndicator}
            </div>
          </div>
          <div className="message-row--image-container">
            {this.getMessageImage()}
          </div>
          <div className="message-row--data-container">
            <div className="message-row--message-type">
              {this.getMessageType()}
              <div className="message-row--age">
                {moment(this.state.message.createdEpoch).fromNow()}
              </div>
            </div>
            <div className="message-row--delete-message">
              {this.deleteMessageButton()}
            </div>

            <div className="message-data--headline">{this.state.message.title}</div>
            <div className="message-data--message-content">{this.getMessageContent()}</div>
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
  groupActions: React.PropTypes.object.isRequired,
  groupState: React.PropTypes.object.isRequired,
  message: React.PropTypes.object.isRequired,
  readAction: React.PropTypes.func.isRequired,
  deleteAction: React.PropTypes.func.isRequired
};
