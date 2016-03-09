'use strict';

import React from 'react';
import {PropTypes} from 'react';

import './create-flag-dialog.scss';

const options = [
  {key: 'incorrect-spelling', text: 'Stavefejl'},
  {key: 'author-is-a-robot', text: 'Forfatteren er en robot'}
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
  }

  onSubmit() {

    if (this.state.selectedCause === null) {
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
        <div className='create-flag-button--button-group'>
          <input className='create-flag-dialog--button--confirm' type='button' value='Luk'
                 onClick={this.props.onClose}/>
        </div>
      </form>
    );

    const radioButtons = options.map((option) => {
      return (
        <label key={option.key}>
          <input type='radio' name='cause' value={option.key} onChange={this.onChangeCause}/>
          {option.text}
        </label>
      );
    });

    const causeForm = (
      <form>
        <h4>Anmeld indhold</h4>

        <p className={(this.state.emphasizeRequiredFields) ? 'create-flag-dialog--required-field--emphasis' : ''}>
          Hvad er årsagen til at du vil anmelde dette indhold?
        </p>

        <div className='create-flag-dialog--radio-group'>
          {radioButtons}
        </div>
        <div className='create-flag-button--button-group'>
          <input className='create-flag-dialog--button--confirm' type='button' value='OK' onClick={this.onSubmit}/>
          <input className='create-flag-dialog--button--cancel' type='button' value='Fortryd'
                 onClick={this.props.onClose}/>
        </div>
      </form>
    );

    return (
      <div className="create-flag-dialog">
        {(this.state.hasBeenSubmitted) ? confirmMessage : causeForm}
      </div>
    );
  }
}

CreateFlagDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  submitFunction: PropTypes.func.isRequired,
  contentType: React.PropTypes.oneOf(['post', 'comment']).isRequired,
  contentId: React.PropTypes.number.isRequired
};
