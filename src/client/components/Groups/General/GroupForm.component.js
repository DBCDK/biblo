'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ColourPicker from './ColourPicker.component';
import DroppableImageField from '../../General/DroppableImageField.component';
import RoundedButtonSubmit from '../../General/RoundedButton.submit.component';
import ProgressBar from '../../General/ProgressBar/ProgressBar.component';

import 'normalize.css';
import './_groupform.component.scss';

export default class GroupForm extends React.Component {
  componentDidMount() {
    let elem = ReactDOM.findDOMNode(this.refs['group-form']);
    elem.onsubmit = (e) => this.props.submit(
      e,
      this.refs.groupNameInput.value,
      this.refs.groupDescriptionArea.value
    );
  }

  render() {
    const errorObj = {};
    this.props.errors.forEach((error) => {
      errorObj[error.field] = (<p className={'errorMessage ' + error.field}>{error.errorMessage}</p>);
    });

    let disabled = false;
    let submitArea = <RoundedButtonSubmit buttonText="OK"/>;

    if (this.props.submitState === 'SUBMITTING') {
      disabled = true;
      submitArea = <ProgressBar completed={this.props.submitProgress} height={'35px'} />;
    }
    else if (this.props.submitState === 'UPLOAD_COMPLETE') {
      disabled = true;
      submitArea = (<ProgressBar completed={this.props.submitProgress} height={'35px'}><p className="progressbar--message">Behandler</p></ProgressBar>);
    }

    return (
      <div className="group-form">
        {errorObj.general || ''}
        <form method="POST" encType="multipart/form-data" id="group_form_component" ref="group-form">
          <div className={'group-image-upload'}>
            <DroppableImageField
              disabled={disabled}
              imageSrc={this.props.groupImageSrc}
              onFile={this.props.changeImageAction}
              fieldName={'group_image'}
            />
            {errorObj.group_image || ''}
          </div>

          <div className={'group-name-field'}>
            <label htmlFor="group-name-input-field"><strong>Gruppens navn</strong></label><br />
            <input
              disabled={disabled}
              id="group-name-input-field"
              name="group-name"
              required
              placeholder="Find på et gruppenavn"
              ref={'groupNameInput'} />
            {errorObj['group-name'] || ''}
          </div>
          <br />

          <div className={'group-description-field'}>
            <label htmlFor="group-description-area"><strong>Beskrivelse af gruppen</strong></label><br />
            <textarea
              disabled={disabled}
              id="group-description-area"
              placeholder="Her kan du skrive lidt om gruppen"
              name="group-description"
              required
              rows="5"
              ref={'groupDescriptionArea'}
            />
            {errorObj['group-description'] || ''}
          </div>
          <br />

          <div className={'group-colour-picker'}>
            <label><strong>Vælg en farve til gruppen</strong></label>
            <ColourPicker
              baseName="group-colour-picker"
              colours={['blueish-green', 'blue', 'red', 'light-purple', 'light-blue', 'yellow']}
              disabled={disabled}
              onChangeFunction={this.props.changeColourAction}
              wrapInForm={false} />
            {errorObj['group-colour-picker_colour'] || ''}
          </div>
          <br />

          <div className={'group-form-submit-button'}>
            {submitArea}
          </div>
        </form>
      </div>
    );
  }
}

GroupForm.displayName = 'GroupForm';
GroupForm.propTypes = {
  changeColourAction: React.PropTypes.func.isRequired,
  changeImageAction: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array.isRequired,
  groupImageSrc: React.PropTypes.string.isRequired,
  submitState: React.PropTypes.string,
  submitProgress: React.PropTypes.number.isRequired,
  submit: React.PropTypes.func.isRequired
};
