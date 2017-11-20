/**
 * @file
 * RenewLoan button that makes use of the RoundedButton component and handles renewing loanes through OpenUserStatus
 * service.
 */

// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
      loan: null,
      renewLoanState: {
        error: null,
        message: null,
        userstatusError: false
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
      const loan = this.getLoan(nextProps.userstatusState.userStatus);
      this.setState({
        renewLoanState: nextProps.userstatusState.renewLoan[this.props.loanId],
        pending: false,
        success: !nextProps.userstatusState.renewLoan[this.props.loanId].error,
        loan: loan
      });
    }
  }

  /**
   * Get the loan from userstatus with a loanId mathcing the loanId given through props.
   * If none is founs null is returned.
   *
   * @param {object} userstatus;
   * @return {object|null} loan
   */
  getLoan(userstatus) {
    let loan = null;

    if (userstatus.loans && Array.isArray(userstatus.loans)) {
      userstatus.loans.forEach((l) => {
        if (l.loanId === this.props.loanId) {
          loan = l;
        }
      });
    }

    return loan;
  }

  /**
   * Clickhandler function. Handling clicks on the button represented by this component.
   *
   * @param {__React.SyntheticEvent} e
   */
  handleClick(e) {
    e.preventDefault();
    if (!this.state.pending) {
      this.setState({pending: true, success: null});
      const params = {loanId: this.props.loanId, createdEpoch: this.props.messageCreatedEpoch};
      this.props.renewLoanAction(params);
    }
  }

  /**
   * Sets the text on the button. If state.pending is true a spinner will replace the text.
   *
   * @return {string}
   */
  getButtonText() {
    let buttonText = 'Lån igen';

    if (this.state.pending) {
      buttonText = <Icon glyph={spinner} width={72}/>;
    }

    return buttonText;
  }

  /**
   * Return an appropriate message to the user dependeing on the answer got from OpenUserStatus
   *
   * @returns {string}
   * @see http://openuserstatus.addi.dk/1.4.1/openuserstatus.xsd -- renewLoanErrorType
   */
  getErrorMessage() {
    switch (this.state.renewLoanState.message) {
      case 'Item not renewable':
        return 'Du kan ikke låne bogen igen';
      case 'Maximum renewals exceeded':
        return 'Materialet kan ikke genlånes flere gange';
      case 'Renewal not allowed - item has outstanding requests':
        return 'Materialet kan ikke genlånes da det er reserveret til en anden bruger';
      default:
        console.error('Uncaught error message from OpenUserStatus', this.state.renewLoanState); // eslint-disable-line no-console
        return '';
    }
  }

  /**
   * Calculates number of days until a given material should be retured and constructs a string based on that.
   *
   * @return {string} str
   */
  getTimeToDueDate() {
    let str = '';
    if (this.state.loan && this.state.success) {
      const diff = moment(this.state.loan.dateDue).diff(moment(), 'days');
      const daysString = diff === 0 ?
        'i dag' :
        (diff > 0 ? 'om ' : '') + Math.abs(diff).toString() + ' dag' + (Math.abs(diff) === 1 ? '' : 'e');
      str = `Du skal nu aflevere ${daysString}`;
    }

    return str;
  }

  render() {
    const buttonText = this.getButtonText();
    const timeToDueDate = this.getTimeToDueDate();

    let content = '';
    const msg = this.state.renewLoanState.error ?
      <span className="renew-loan-button--try-again-msg">Der skete en fejl. Prøv igen.</span> :
      null;

    if (this.state.renewLoanState.userstatusError) {
      content = <span className="renew-loan-button--msg--error">{this.getErrorMessage()}</span>;
    }
    else if (this.state.success) {
      content =
        <span className="renew-loan-button--msg--success">Du har lånt {this.props.materialTitle} igen. {timeToDueDate}</span>;
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

RenewLoanButton.propTypes = {
  className: PropTypes.string,
  loanId: PropTypes.string.isRequired,
  renewLoanAction: PropTypes.func.isRequired,
  userstatusState: PropTypes.object.isRequired,
  materialTitle: PropTypes.string.isRequired,
  messageCreatedEpoch: PropTypes.number.isRequired
};

RenewLoanButton.defaultProps = {
  className: ''
};

