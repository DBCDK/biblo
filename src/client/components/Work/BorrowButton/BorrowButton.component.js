import React from 'react';
import {ORDER_POST_URL} from '../../../Constants/hyperlinks.constants';

import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import Icon from '../../General/Icon/Icon.component';
import {ProfileLibraryInfo} from '../../Profile/Edit/ProfileLibraryInfo.component';
import Message from '../../General/Message/Message.component.js';

import animalpaw from '../../General/Icon/svg/Materialikon-kvadrat-small/animalpaw.svg';
import audiobook from '../../General/Icon/svg/Materialikon-kvadrat-small/audiobook_no_border.svg';
import book from '../../General/Icon/svg/Materialikon-kvadrat-small/book_no_border.svg';
import ebook from '../../General/Icon/svg/Materialikon-kvadrat-small/ebook_no_border.svg';
import film from '../../General/Icon/svg/Materialikon-kvadrat-small/film_no_border.svg';
import flag from '../../General/Icon/svg/Materialikon-kvadrat-small/flag.svg';
import game from '../../General/Icon/svg/Materialikon-kvadrat-small/game_no_border.svg';
import group from '../../General/Icon/svg/Materialikon-kvadrat-small/group_no_border.svg';
import music from '../../General/Icon/svg/Materialikon-kvadrat-small/music_no_border.svg';
import photo from '../../General/Icon/svg/Materialikon-kvadrat-small/photo.svg';
import smiley from '../../General/Icon/svg/Materialikon-kvadrat-small/smiley.svg';

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
      selectedPid: false,
      loanerId: '',
      pincode: '',
      libraryId: '',
      hasOnlineAcces: false,
      errorObj: {}
    };

    this.submitOrderForm.bind(this);
    this.renderOrderForm.bind(this);
    this.renderLibrarySelector.bind(this);
    this.submitLibraryForm.bind(this);
  }

  componentDidMount() {
    if (this.props.profile.userIsLoggedIn) {
      this.props.checkAvailabilityAction(this.props.collection);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.favoriteLibrary && this.state.libraryId !== nextProps.profile.favoriteLibrary.libraryId) {
      this.setState({libraryId: nextProps.profile.favoriteLibrary.libraryId});
    }

    const collectionsObject = {};
    let collectionType;
    nextProps.collectionDetails.forEach((collectionItem) => {
      collectionType = collectionItem.type;
      collectionsObject[collectionType] = collectionItem;
    });

    if (Object.keys(collectionsObject).length === 1 && collectionsObject[collectionType].accessType[0] !== 'online') {
      this.onChange(collectionsObject[collectionType], {target: {value: collectionsObject[collectionType].pid[0]}});
    }
  }

  submitOrderForm(e) {
    e.preventDefault();
    if (this.state.onlineUrl) {
      if (window) {
        window.open(this.state.onlineUrl, '_blank'); // redirect to online access
      }
    }
    else if (this.state.selectedPid) {
      this.props.orderMaterialAction(this.state.selectedPid);
    }
    else {
      this.setState({
        errors: [{
          field: 'mustSelectItem',
          errorMessage: 'Du skal vælge hvad du vil låne, før du trykker OK'
        }]
      });
    }
  }

  onChange(collectionItem, e) {
    let onlineUrl;
    if (collectionItem.accessType[0] === 'online' && !!collectionItem.hasOnlineAccess) {
      onlineUrl = collectionItem.hasOnlineAccess[0];
    }

    this.setState({
      selectedPid: e.target.value,
      onlineUrl: onlineUrl // url for the online resource. undefined if none . Note that this is pr pid.
    });
  }

  renderOrderForm(collectionsObject) {
    const messageObj = {};

    if (this.state.errors) {
      this.state.errors.forEach((error) => {
        messageObj[error.field] = (
          <Message type='error'>
            <span className={`error-${error.field}`}> {error.errorMessage} </span>
          </Message>
        );
      });
    }

    let checked;
    if (Object.keys(collectionsObject).length === 1 && collectionsObject[Object.keys(collectionsObject)[0]].accessType[0] !== 'online') {
      checked = true;
    }

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
                         checked={checked}
                         id={`${collectionItem.workType}${collectionItem.pid}`}
                         onChange={this.onChange.bind(this, collectionItem)}/>
                  <label htmlFor={`${collectionItem.workType}${collectionItem.pid}`}>
                    <Icon glyph={materialSvgs[collectionItem.workType]} width={25}
                          height={25}/> {collectionItem.type}
                  </label>
                </span>
              );
            })
          }
        </div>
        {messageObj.mustSelectItem}
        {this.state.onlineUrl &&
        <span>
          <RoundedButton className='onlinelink' href={this.state.onlineUrl} target='_blank' buttonText="HENT ONLINE"/>
          <p className="modal-window--message-under-submit-button">
            Du viderestilles til en anden hjemmeside i et nyt vindue.
          </p>
          </span>
        ||
        <span>
          <input type="submit" value="OK" className="modal-window--borrow-submit-button"/>
           <p className="modal-window--message-under-submit-button">
             Du får besked fra dit bibliotek, når bogen er klar til at du kan hente den.
           </p>
         </span>
        }
      </form>
    );
  }

  submitLibraryForm(e) {
    e.preventDefault();
    // imageFile, displayname, email, phone, libraryId, loanerId, pincode, description, birthday, fullName, options
    this.props.saveProfileAction(
      null,
      this.props.profile.displayName,
      this.props.profile.email,
      this.props.profile.phone,
      this.state.libraryId,
      this.state.loanerId,
      this.state.pincode,
      this.props.profile.description,
      this.props.profile.birthday,
      this.props.profile.fullName,
      {
        preventRedirect: true,
        formLocation: '/profil/rediger'
      }
    );
  }

  renderLibrarySelector(profile, libraryIsInvalid) {
    let message = (<p>Du skal udfylde lånerinformation for at bestille materialer</p>);

    if (libraryIsInvalid) {
      message = (
        <p>Det bibliotek du har valgt modtager ikke bestillinger, vælg venligst et nyt bibliotek for at bestille.</p>
      );
    }

    return (
      <div>
        {message}
        <form onSubmit={this.submitLibraryForm.bind(this)}>
          <ProfileLibraryInfo
            errorObj={this.state.errorObj}
            favoriteLibrary={libraryIsInvalid ? {} : profile.favoriteLibrary}
            unselectLibraryFunction={this.props.unselectLibraryFunction}
            search=""
            searchAction={this.props.searchForLibraryAction}
            searchElements={this.props.librarySearchResults}
            libraryId={this.state.libraryId}
            loanerIdChangeFunc={(e) => this.setState({loanerId: e.target.value})}
            pincodeChangeFunc={(e) => this.setState({pincode: e.target.value})}
            requireAll={true}/>
          <input type="submit" value="OK" className="modal-window--borrow-submit-button"/>
        </form>
      </div>
    );
  }

  placeOrderModal(collectionDetails, checkAvailabilityResult, checkAvailabilityDone, orderState, profile, onClose) {
    const collectionsObject = {};
    collectionDetails.forEach((collectionItem) => {

      // get actual url if accessType is online
      if (collectionItem.accessType[0] === 'online') {
        this.props.getWorkOnlineAccessAction([collectionItem.pid[0]]);
      }

      if (checkAvailabilityResult[collectionItem.pid[0]] && !collectionsObject[collectionItem.type] || collectionItem.accessType[0] === 'online') {
        collectionsObject[collectionItem.type] = collectionItem;
      }
    });

    const collectionObjectSize = Object.keys(collectionsObject).length;
    let modalContent = '';

    // User isn't logged in
    if (!profile.userIsLoggedIn) {
      modalContent = (
        <div>
          <p>Du skal logge ind for at låne</p>
          <RoundedButton href={`/login?destination=${encodeURIComponent(window.location)}`} buttonText="Login"
                         compact={false}/>
        </div>
      );
    }
    // User is logged in, but doesn't have any borrower info
    else if (
      !profile.favoriteLibrary ||
      (profile.hasOwnProperty('favoriteLibrary') && !(
        profile.favoriteLibrary.hasOwnProperty('libraryId') &&
        profile.favoriteLibrary.hasOwnProperty('loanerId') &&
        profile.favoriteLibrary.hasOwnProperty('pincode')
      ))
    ) {
      modalContent = this.renderLibrarySelector(profile);
    }
    // The users library is invalid, we want them to select a new one.
    else if (profile.favoriteLibrary.temporarilyClosed || !profile.favoriteLibrary.pickupAllowed) {
      modalContent = this.renderLibrarySelector(profile, true);
    }
    // Currently ordering work
    else if (orderState === 1) {
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
    // CheckAvailability says you can't borrow this work
    else if (orderState === 3 || checkAvailabilityDone && collectionObjectSize <= 0) {
      modalContent = (
        <div>
          <p>Du kan desværre ikke låne denne bog.</p>
          <p>Prøv at spørge på dit eget bibliotek, om de kan hjælpe dig med at låne den på en anden måde.</p>
          <RoundedButton clickFunction={onClose} buttonText="ØV" compact={false}/>
        </div>
      );
    }
    else if (orderState === 4) {
      modalContent = (
        <div>
          <p>Dine lånerdata er ikke blevet genkendt, gå venligst ind på din profil og ret dem.</p>
          <RoundedButton clickFunction={onClose} buttonText="ØV" compact={false}/>
        </div>
      );
    }
    // Show options filtered to unique types.
    else if (collectionObjectSize > 0) {
      modalContent = this.renderOrderForm(collectionsObject);
    }
    // CheckAvailability has not returned results yet.
    else {
      modalContent = (
        <p>Vent venligst mens vi checker hvilke udgaver du kan låne.</p>
      );
    }

    return (
      <ModalWindow onClose={onClose} title="LÅN">
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

  closeModal() {
    this.setState({displayModal: false});
    this.props.resetOrderState();
  }

  render() {
    return (
      <span>
        {this.state.displayModal &&
        this.placeOrderModal(
          this.props.collectionDetails,
          this.props.checkAvailabilityResult,
          this.props.checkAvailabilityDone,
          this.props.orderState,
          this.props.profile,
          this.closeModal.bind(this)
        )}
        <a className='work-detail--order-button' onClick={() => this.setState({displayModal: true})}>LÅN</a>
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
  saveProfileAction: React.PropTypes.func.isRequired,
  unselectLibraryFunction: React.PropTypes.func.isRequired,
  searchForLibraryAction: React.PropTypes.func.isRequired,
  librarySearchResults: React.PropTypes.array.isRequired,
  checkAvailabilityAction: React.PropTypes.func.isRequired,
  checkAvailabilityResult: React.PropTypes.object,
  checkAvailabilityDone: React.PropTypes.bool,
  resetOrderState: React.PropTypes.func.isRequired,
  profile: React.PropTypes.object,
  getWorkOnlineAccessAction: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array
};

BorrowButton.defaultProps = {
  orderState: 0,
  checkAvailabilityResult: {},
  checkAvailabilityDone: false,
  profile: {
    userIsLoggedIn: false
  }
};
