import React from 'react';
import {PropTypes} from 'react';

import './create-flag-dialog.scss';

const options = [
  {
    key: 'der er skrevet noget dårligt om mig',
    text: 'Der er skrevet noget dårligt om mig'
  },
  {
    key: 'der er skrevet noget dårligt om andre',
    text: 'Der er skrevet noget dårligt om andre'
  },
  {
    key: 'der er skrevet nogle grimme ord',
    text: 'Der er skrevet nogle grimme ord'
  },
  {
    key: 'der er billeder eller video som jeg ikke kan lide på siden',
    text: 'Der er billeder eller video som jeg ikke kan lide på siden'
  }
];

export default class CreateFlagDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCause: null,
      hasBeenSubmitted: false,
      emphasizeRequiredFields: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeCause = this.onChangeCause.bind(this);
    this.onSelectTextInput = this.onSelectTextInput.bind(this);
  }

  onSubmit() {
    if (this.state.selectedCause === 'andet') {
      if (this.refs.otherCauseTextInput.value !== '') {
        // submit free-text cause
        this.props.submitFunction({
          cause: this.refs.otherCauseTextInput.value,
          contentId: this.props.contentId
        });
        this.setState({hasBeenSubmitted: true});
      }
      else {
        // free-text field cannot be empty
        this.setState({emphasizeRequiredFields: true});
      }
    }
    else if (this.state.selectedCause === null) {
      this.setState({emphasizeRequiredFields: true});
    }
    else {
      this.props.submitFunction({
        cause: this.state.selectedCause,
        contentId: this.props.contentId
      });
      this.setState({hasBeenSubmitted: true});
    }
  }

  onSelectTextInput() {
    this.setState({
      selectedCause: 'andet'
    });
  }

  onChangeCause(e) {
    this.setState({
      emphasizeRequiredFields: false,
      selectedCause: e.currentTarget.value
    });
  }

  render() {

    const confirmMessage = (
      <form>
        <h4>Tak for din henvendelse</h4>
        <p>Vores moderatorer er blevet underrettet om det anmeldte indhold.</p>
        <div className='create-flag-button--button-group' >
          <input className='create-flag-dialog--button--confirm' type='button' value='Luk'
                 onClick={this.props.onClose} />
        </div>
      </form>
    );

    const radioButtons = options.map((option) => {
      return (
        <label key={option.key} >
          <input type='radio' name='cause' value={option.key} onChange={this.onChangeCause} />
          {option.text}
        </label>
      );
    });

    const radioGroup = (
      <div className='create-flag-dialog--radio-group' >
        {radioButtons}
        <label key='optional-field' >
          <input type='radio' name='cause' value='andet' checked={this.state.selectedCause === 'andet'} onChange={this.onChangeCause} />
          Anden forklaring
          <textArea className='create-flag-dialog--other-cause' ref='otherCauseTextInput' type='text' onFocus={this.onSelectTextInput} />
        </label>
      </div>
    );

    const causeForm = (
      <form>
        <h4>Anmeld indhold</h4>

        <p className={(this.state.emphasizeRequiredFields) ? 'create-flag-dialog--required-field--emphasis' : ''} >
          Hvad er årsagen til at du vil anmelde dette indhold?
        </p>

        {radioGroup}
        <div className='create-flag-button--button-group' >
          <input className='create-flag-dialog--button--confirm' type='button' value='OK' onClick={this.onSubmit} />
          <input className='create-flag-dialog--button--cancel' type='button' value='Fortryd'
                 onClick={this.props.onClose} />
        </div>
      </form>
    );

    return (
      <div className="create-flag-dialog" >
        {(this.state.hasBeenSubmitted) ? confirmMessage : causeForm}
      </div>
    );
  }
}

CreateFlagDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  submitFunction: PropTypes.func.isRequired,
  contentType: React.PropTypes.oneOf(['post', 'comment', 'review']).isRequired,
  contentId: React.PropTypes.number.isRequired
};

CreateFlagDialog.defaultProps = {
  onClose: () => {
    console.error('YO DEV! You should provide your own onClose method. This is the default being called which shouldn\'t happen. Check your props!'); // eslint-disable-line
  },
  contentId: -1
};
