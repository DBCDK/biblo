'use strict';

import React from 'react';

import ColourPicker from './ColourPicker.component';
import DroppableImageField from '../../General/DroppableImageField.component';
import RoundedButtonSubmit from '../../General/RoundedButton.submit.component';

import 'normalize.css';
import './_groupform.component.scss';

export default class GroupForm extends React.Component {
  constructor() {
    super();
    this.state = {
      file: null
    };
  }

  componentDidMount() {
    if ('FormData' in window) {
      let formElement = document.getElementById('group_form_component');
      formElement.onsubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(formElement);
        if (this.state.file) {
          formData.append('droppableimagefield', this.state.file)
        }

        let request = new XMLHttpRequest();
        request.open('POST', window.location.href);
        request.onreadystatechange = (e) => {
          if (
            e.currentTarget.readyState === 4 &&
            e.currentTarget.status !== 404 &&
            e.currentTarget.status !== 500 &&
            e.currentTarget.status !== 403
          ) {
            console.log(e);
          }
        };
        request.send(formData);
      };
    }
  }

  fileWasRecieved(file) {
    this.setState({
      file
    })
  }

  render() {
    return (
      <div className="group-form">
        <form method="POST" encType="multipart/form-data" id="group_form_component" ref="group-form">
          <div className="group-image-upload">
            <DroppableImageField
              onFile={this.fileWasRecieved.bind(this)}
            />
          </div>

          <div className="group-name-field">
            <label htmlFor="group-name-input-field"><strong>Gruppens navn</strong></label><br />
            <input id="group-name-input-field" name="group-name" required placeholder="Find på et gruppenavn" />
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
            />
          </div>
          <br />

          <div className="group-colour-picker">
            <label><strong>Vælg en farve til gruppen</strong></label>
            <ColourPicker
              baseName="group-colour-picker"
              onChangeFunction={() => {}}
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
