import React from 'react';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import {ORDER_POST_URL} from '../../../Constants/hyperlinks.constants';

import './BorrowButton.component.scss';

export default class BorrowButton extends React.Component {
  constructor() {
    super();

    this.state = {
      displayModal: false
    };
  }

  /*

   <label className="modal-window--collection-item--selector">
   <div>
   <span className="modal-window--collection-item--name">{collectionItem.type}</span>
   <input type="radio" name="order" value={collectionItem.pid}/>
   <span />
   </div>
   </label>

   */

  placeOrderModal(collection, collectionDetails, onClose) {
    let collectionsObject = {};

    collectionDetails.forEach((collectionItem) => {
      if (!collectionsObject[collectionItem.type]) {
        collectionsObject[collectionItem.type] = collectionItem;
      }
    });

    return (
      <ModalWindow onClose={onClose} title="Lån">
        <div className="modal-window--borrow-container">
          <div className="modal-window--work-details">
            <img src={this.props.coverUrl}/>
            <h3>{this.props.workTitle}</h3>
          </div>

          <form action={ORDER_POST_URL} method="POST">
            <h3>Vælg hvad du vil låne</h3>
            <div className="modal-window--borrow--types">
              {
                Object.keys(collectionsObject).map((collectionItemKey) => {
                  let collectionItem = collectionsObject[collectionItemKey];
                  return (
                    <span key={collectionItem.pid} className="modal-window--collection-item--container">
                      <input type="radio" name="mediaType" value={collectionItem.pid}
                             id={`${collectionItem.workType}${collectionItem.pid}`}/>
                      <label htmlFor={`${collectionItem.workType}${collectionItem.pid}`}>{collectionItem.type}</label>
                    </span>
                  );
                })
              }
            </div>
            <input type="submit" value="OK" className="modal-window--borrow-submit-button"/>
            <p className="modal-window--message-under-submit-button">
              Du får besked fra dit eget bibliotek, når bogen er klar til dig.
            </p>
          </form>
        </div>
      </ModalWindow>
    );
  }

  render() {
    return (
      <span>
        {this.state.displayModal && this.placeOrderModal(this.props.collection, this.props.collectionDetails, () => this.setState({displayModal: false}))}
        <a className='work-detail--order-button' onClick={() => this.setState({displayModal: true})}>Lån</a>
      </span>
    );
  }
}

BorrowButton.propTypes = {
  collection: React.PropTypes.array.isRequired,
  collectionDetails: React.PropTypes.array.isRequired,
  coverUrl: React.PropTypes.string.isRequired,
  workTitle: React.PropTypes.string.isRequired
};
