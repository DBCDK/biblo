/**
 * @file
 * RenewLoan button that makes use of the RoundedButton component and handles renewing loanes through OpenUserStatus
 * service.
 */

// Libraries
import React from 'react';

// Components
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import Icon from '../../General/Icon/Icon.component.js';

// SVGs
import spinner from '../../General/Icon/svg/spinners/loading-spin.svg';

// SCSS
import './scss/RenewLoanButton.scss';

export default class RenewLoanButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
      succes: null,
      renewLoanState: {
        error: null,
        message: null,
        userStatusError: false
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Component should only update if anything new has happend
    return !!nextProps.userstatusState.renewLoan[this.props.loanId] || JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  componentWillReceiveProps(nextProps) {
    // Update the components state but only if it's relevant for this particular component
    if (nextProps.userstatusState.renewLoan[this.props.loanId]) {
      this.setState({
        renewLoanState: nextProps.userstatusState.renewLoan[this.props.loanId],
        pending: false,
        success: !nextProps.userstatusState.renewLoan[this.props.loanId].error
      });
    }
  }

  handleClick(e) {
    e.preventDefault();
    if (!this.state.pending) {
      this.setState({pending: true, success: null});
      this.props.renewLoanAction(this.props.loanId);
    }
  }

  getButtonText() {
    let buttonText = 'Lån igen';

    if (this.state.pending) {
      buttonText = <Icon glyph={spinner} width={72}/>;
    }

    return buttonText;
  }

  getErrorMessage() {
    switch (this.state.renewLoanState.message) {
      case 'Item not renewable':
        return 'Du kan ikke låne bogen igen';
      default:
        console.error('Uncaught error message from OpenUserStatus', this.state.renewLoanState); // eslint-disable-line no-console
        return '';
    }
  }

  render() {
    const buttonText = this.getButtonText();

    let content = '';
    const msg = this.state.error ?
      <span className="renew-loan-button--try-again-msg">Der skete en fejl. Prøv igen.</span> :
      null;

    if (this.state.renewLoanState.userStatusError) {
      content = <span className="renew-loan-button--msg--error">{this.getErrorMessage()}</span>;
    }
    else if (this.state.success) {
      content = <span className="renew-loan-button--msg--success">Du har lånt {this.props.materialTitle} igen.</span>;
    }
    else {
      content = (
        <span>
          <RoundedButton
            buttonText={buttonText}
            compact={true}
            clickFunction={this.handleClick.bind(this)}
            className="message-row--renew-loan-button"
          />
          {msg}
        </span>
      );
    }

    return content;
  }
}

RenewLoanButton.PropTypes = {
  className: React.PropTypes.string,
  loanId: React.PropTypes.string.isRequired,
  renewLoanAction: React.PropTypes.func.isRequired,
  userstatusState: React.PropTypes.object.isRequired,
  materialTitle: React.PropTypes.string.isRequired
};

RenewLoanButton.defaultProps = {
  className: ''
};

