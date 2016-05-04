import React from 'react';
import {ORDER_POST_URL} from '../../../Constants/hyperlinks.constants';

import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import Icon from '../../General/Icon/Icon.component';

import animalpaw from '../../General/Icon/svg/Materialikon-kvadrat small/animalpaw.svg';
import audiobook from '../../General/Icon/svg/Materialikon-kvadrat small/audiobook_no_border.svg';
import book from '../../General/Icon/svg/Materialikon-kvadrat small/book_no_border.svg';
import ebook from '../../General/Icon/svg/Materialikon-kvadrat small/ebook_no_border.svg';
import film from '../../General/Icon/svg/Materialikon-kvadrat small/film_no_border.svg';
import flag from '../../General/Icon/svg/Materialikon-kvadrat small/flag.svg';
import game from '../../General/Icon/svg/Materialikon-kvadrat small/game_no_border.svg';
import group from '../../General/Icon/svg/Materialikon-kvadrat small/group.svg';
import music from '../../General/Icon/svg/Materialikon-kvadrat small/music_no_border.svg';
import photo from '../../General/Icon/svg/Materialikon-kvadrat small/photo.svg';
import smiley from '../../General/Icon/svg/Materialikon-kvadrat small/smiley.svg';

import './BorrowButton.component.scss';

const materialSvgs = {
  animalpaw,
  audiobook,
  book,
  ebook,
  film,
  flag,
  game,
  group,
  music,
  photo,
  smiley
};

export default class BorrowButton extends React.Component {
  constructor() {
    super();

    this.state = {
      displayModal: false,
      selectedPid: false
    };

    this.submitOrderForm.bind(this);
    this.renderOrderForm.bind(this);
  }

  componentDidMount() {
    this.props.checkOrderPolicyAction(this.props.collection);
  }

  submitOrderForm(e) {
    e.preventDefault();

    if (this.state.selectedPid) {
      this.props.orderMaterialAction(this.state.selectedPid);
    }
  }

  renderOrderForm(collectionsObject) {
    return (
      <form action={ORDER_POST_URL} method="POST" onSubmit={(e) => this.submitOrderForm(e)}>
        <h3>Vælg hvad du vil låne</h3>
        <div className="modal-window--borrow--types">
          {
            Object.keys(collectionsObject).map((collectionItemKey) => {
              let collectionItem = collectionsObject[collectionItemKey];
              return (
                <span key={collectionItem.pid} className="modal-window--collection-item--container">
                  <input type="radio" name="mediaType" value={collectionItem.pid}
                         id={`${collectionItem.workType}${collectionItem.pid}`}
                         onChange={(e) => this.setState({selectedPid: e.target.value})}/>
                  <label htmlFor={`${collectionItem.workType}${collectionItem.pid}`}>
                    <Icon glyph={materialSvgs[collectionItem.workType]} width={25}
                          height={25}/> {collectionItem.type}
                  </label>
                </span>
              );
            })
          }
        </div>
        <input type="submit" value="OK" className="modal-window--borrow-submit-button"/>
        <p className="modal-window--message-under-submit-button">
          Du får besked fra dit bibliotek, når bogen er klar til at du kan hente den.
        </p>
      </form>
    );
  }

  placeOrderModal(collectionDetails, checkOrderPolicyResult, checkOrderPolicyDone, orderState, onClose) {
    let collectionsObject = {};

    collectionDetails.forEach((collectionItem) => {
      if (checkOrderPolicyResult[collectionItem.pid[0]] && !collectionsObject[collectionItem.type]) {
        collectionsObject[collectionItem.type] = collectionItem;
      }
    });

    const collectionObjectSize = Object.keys(collectionsObject).length;

    let modalContent = '';

    // Currently ordering work
    if (orderState === 1) {
      modalContent = (
        <p>Bestiller materialet! Vent venligst!</p>
      );
    }
    // The order has gone through
    else if (orderState === 2) {
      modalContent = (
        <div>
          <p>Din bestilling er sendt.</p>
          <p>Du får besked fra dit bibliotek, når bogen er klar til at du kan hente den.</p>
          <RoundedButton clickFunction={onClose} buttonText="PERFEKT" compact={false}/>
        </div>
      );
    }
    // An error occured during order or
    // CheckOrderPolicy says you can't borrow this work
    else if (orderState === 3 || checkOrderPolicyDone && collectionObjectSize <= 0) {
      modalContent = (
        <div>
          <p>Du kan desværre ikke låne denne bog.</p>
          <p>Prøv at spørge på dit eget bibliotek, om de kan hjælpe dig med at låne den på en anden måde.</p>
          <RoundedButton clickFunction={onClose} buttonText="ØV" compact={false}/>
        </div>
      );
    }
    // Show options filtered to unique types.
    else if (collectionObjectSize > 0) {
      modalContent = this.renderOrderForm(collectionsObject);
    }
    // CheckOrderPolicy has not returned results yet.
    else {
      modalContent = (
        <p>Vent venligst mens vi checker hvilke udgaver du kan låne.</p>
      );
    }

    return (
      <ModalWindow onClose={onClose} title="Lån">
        <div className="modal-window--borrow-container">
          <div className="modal-window--work-details">
            <img src={this.props.coverUrl}/>
            <h3>{this.props.workTitle}</h3>
          </div>

          {modalContent}
        </div>
      </ModalWindow>
    );
  }

  render() {
    return (
      <span>
        {this.state.displayModal &&
        this.placeOrderModal(
          this.props.collectionDetails,
          this.props.checkOrderPolicyResult,
          this.props.checkOrderPolicyDone,
          this.props.orderState,
          () => this.setState({displayModal: false})
        )}
        <a className='work-detail--order-button' onClick={() => this.setState({displayModal: true})}>Lån</a>
      </span>
    );
  }
}

BorrowButton.propTypes = {
  collection: React.PropTypes.array.isRequired,
  collectionDetails: React.PropTypes.array.isRequired,
  coverUrl: React.PropTypes.string.isRequired,
  workTitle: React.PropTypes.string.isRequired,
  orderMaterialAction: React.PropTypes.func.isRequired,
  orderState: React.PropTypes.number,
  checkOrderPolicyAction: React.PropTypes.func.isRequired,
  checkOrderPolicyResult: React.PropTypes.object,
  checkOrderPolicyDone: React.PropTypes.bool
};

BorrowButton.defaultProps = {
  orderState: 0,
  checkOrderPolicyResult: {},
  checkOrderPolicyDone: false
};
