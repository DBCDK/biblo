import React from 'react';
import Cookies from 'js-cookie';

// Components
import ModalWindow from '../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';

// Styling
import './scss/cookie-warning.scss';

// SVGs
import logo from './biblo_logo_100x30.svg';

export default class CookieWarningContainer extends React.Component {
  constructor() {
    super();

    // Assume they've already seen the warning
    this.state = {
      displayWarning: false
    };

    // Correct once we have access to the cookie
    if (typeof window !== 'undefined') {
      this.state.displayWarning = !Cookies.get('reddi-fe-cookie');
    }
  }

  onClose() {
    Cookies.set('reddi-fe-cookie', 'bum-bum', {expires: 365});
    this.setState({displayWarning: false});
  }

  render() {
    return (
      this.state.displayWarning &&
      <ModalWindow onClose={this.onClose.bind(this)} >
        <div className="cookie-warning" >
          <div className="cookie-warning--svg">
            <svg><use xlinkHref={logo} /></svg>
          </div>
          <span className="cookie-warning--header" >
            Velkommen til biblo.dk
          </span>
          <span className="cookie-warning--message" >
            For at gøre siden så let at bruge som muligt gemmer vi det du laver på sitet i noget, der hedder en cookie.
          </span>
          <RoundedButton buttonText="OK" clickFunction={this.onClose.bind(this)} />
        </div>
      </ModalWindow>
    );
  }
}
