/**
 * @file: display logout warning. Display this if the user is logged out.
 */
import React from 'react';

import ModalWindow from '../General/ModalWindow/ModalWindow.component';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';

import './scss/logout-warning.scss';


export default class LogoutWarningContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      displayWarning: true
    };
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.setState({displayWarning: false});
  }

  render() {
    return (
      this.state.displayWarning &&
      <ModalWindow onClose={this.onClose.bind(this)} >
        <div className="logout-warning" >
          <div className='icon-container'>
            <img className='icon' src='/images/rocket.png'/>
          </div>
          <span className="header" >
            Du er nu logget ud af biblo.dk
          </span>
          <span className="message" >
            For at logge helt ud af Uni-Login skal du lukke alle faner og vinduer i din browser.
          </span>
          <RoundedButton buttonText="OK" clickFunction={this.onClose} />
        </div>
      </ModalWindow>
    );
  }
}
