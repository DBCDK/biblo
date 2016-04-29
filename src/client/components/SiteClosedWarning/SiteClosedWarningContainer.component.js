import React from 'react';
import Cookies from 'js-cookie';
import isSiteOpen from '../../Utils/openingHours.js';

// Components
import ModalWindow from '../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';

// Styling
import './scss/site-closed-warning.scss';

// SVGs
import logo from './skrivepause.svg';

export default class SiteClosedWarningContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      displayWarning: !Cookies.get('site-closed-warning-was-seen') && !isSiteOpen()
    };
  }

  onClose() {
    // warning will be ready to be displayed in ½ day
    Cookies.set('site-closed-warning-was-seen', 'true', {expires: 0.5});
    this.setState({displayWarning: false});
  }

  render() {
    return (
      this.state.displayWarning &&
      <ModalWindow onClose={this.onClose.bind(this)} >
        <div className="site-closed-warning" >
          <div className="site-closed-warning--svg">
            <svg><use xlinkHref={logo} /></svg>
          </div>
          <span className="site-closed-warning--header" >
            <p>Indtil kl. 9 kan du kun læse og se indholdet her på Biblo.</p>
          </span>
          <span className="site-closed-warning--message" >
            <p>
              Fra kl. 9-21 kan du igen skrive indlæg og kommentarer.
              <br/>
              Nu er det tid til at læse bøger, se film, høre musik og sove... Vi skrives ved kl. 9
              <br/>
              <a href='/indhold/aabningstider' onClick={this.onClose.bind(this)}>
              Læs mere
            </a>
            </p>
          </span>
          <RoundedButton buttonText="OK" clickFunction={this.onClose.bind(this)} />
        </div>
      </ModalWindow>
    );
  }
}
