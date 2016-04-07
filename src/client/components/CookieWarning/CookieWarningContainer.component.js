'use strict';

import React from 'react';
import Cookies from 'js-cookie';

// Components
import ModalWindow from '../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';

// Styling
import './scss/cookie-warning.scss';

export default class CookieWarningContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      displayWarning: !Cookies.get('reddi-fe-cookie')
    };
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
          <img src="https://media.giphy.com/media/1ngQorBCDcUFy/giphy.gif" alt="" />
          <span className="cookie-warning--message" >
            Biblo bruger cookies til at huske dine indstillinger og til statistik. Læs mere om cookies under "Spørgsmål og svar" nederst på siden.
          </span>
          <RoundedButton buttonText="OK" clickFunction={this.onClose.bind(this)} />
        </div>
      </ModalWindow>
    );
  }
}
