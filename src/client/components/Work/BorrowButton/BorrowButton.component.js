import React from 'react';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import {ORDER_POST_URL} from '../../../Constants/hyperlinks.constants';

import './BorrowButton.component.scss';

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
                             onChange={(e) => this.setState({selectedPid: e.target.value})} />
                      <label htmlFor={`${collectionItem.workType}${collectionItem.pid}`}>{collectionItem.type}</label>
                    </span>
              );
            })
          }
        </div>
        <input type="submit" value="OK" className="modal-window--borrow-submit-button"/>
        
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

    if (orderState === 1) {
      modalContent = (
        <p>Bestiller materialet! Vent venligst!</p>
      );
    }
    else if (orderState === 2) {
      modalContent = (
        <p>Din bestilling er blevet sendt til dit valgte bibliotek!</p>
      );
    }
    else if (orderState === 3) {
      modalContent = (
        <p>Der skete en fejl under bestillingen af dette materiale! Prøv igen senere!</p>
      );
    }
    else if (checkOrderPolicyDone && collectionObjectSize <= 0) {
      modalContent = (
        <p>Du kan desværre ikke låne dette materiale til dit valgte bibliotek.</p>
      );
    }
    else if (collectionObjectSize > 0) {
      modalContent = this.renderOrderForm(collectionsObject);
    }
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
          
          <p className="modal-window--message-under-submit-button">
            Du får besked fra dit eget bibliotek, når bogen er klar til dig.
          </p>
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
