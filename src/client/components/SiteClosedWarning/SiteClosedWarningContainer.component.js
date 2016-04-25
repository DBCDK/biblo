import React from 'react';
import Cookies from 'js-cookie';
import isSiteOpen from '../../Utils/openingHours.js';

// Components
import ModalWindow from '../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';

// Styling
import './scss/site-closed-warning.scss';

// SVGs
import logo from './pause.svg';

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
            <p>Vi holder pause mellem kl. 21 og 9.</p>
          </span>
          <span className="site-closed-warning--message" >
            <p>Det betyder, at du kan skrive indlæg og kommentarer på Biblo hver dag mellem kl. 9 og 21.</p>
            <p>
              Resten af tiden kan du kun læse indlæg og kommentarer. <a href='/indhold/aabningstider' onClick={this.onClose.bind(this)}>
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
