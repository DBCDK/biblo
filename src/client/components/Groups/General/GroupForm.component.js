'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ColourPicker from './ColourPicker.component';
import DroppableImageField from '../../General/DroppableImageField.component';
import RoundedButtonSubmit from '../../General/RoundedButton.submit.component';

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
    return (
      <div className="group-form">
        <form method="POST" encType="multipart/form-data" id="group_form_component" ref="group-form">
          <div className="group-image-upload">
            <DroppableImageField
              imageSrc={this.props.groupImageSrc}
              onFile={this.props.changeImageAction}
              fieldName={'group_image'}
            />
          </div>

          <div className="group-name-field">
            <label htmlFor="group-name-input-field"><strong>Gruppens navn</strong></label><br />
            <input id="group-name-input-field" name="group-name" required placeholder="Find på et gruppenavn" ref={"groupNameInput"} />
          </div>
          <br />

          <div className="group-description-field">
            <label htmlFor="group-description-area"><strong>Beskrivelse af gruppen</strong></label><br />
            <textarea
              id="group-description-area"
              placeholder="Her kan du skrive lidt om gruppen"
              name="group-description"
              required
              rows="5"
              ref={"groupDescriptionArea"}
            />
          </div>
          <br />

          <div className="group-colour-picker">
            <label><strong>Vælg en farve til gruppen</strong></label>
            <ColourPicker
              baseName="group-colour-picker"
              colours={['blueish-green', 'blue', 'red', 'light-purple', 'light-blue', 'yellow']}
              onChangeFunction={this.props.changeColourAction}
              wrapInForm={false} />
          </div>
          <br />

          <div className="group-form-submit-button">
            <RoundedButtonSubmit
              buttonText="OK"
            />
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
  groupImageSrc: React.PropTypes.string.isRequired,
  submit: React.PropTypes.func.isRequired
};
