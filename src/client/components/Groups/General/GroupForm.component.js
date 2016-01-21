'use strict';

import React from 'react';

import ColourPicker from './ColourPicker.component';
import DroppableImageField from '../../General/DroppableImageField.component';

import 'normalize.css';
import './_groupform.component.scss';

export default class GroupForm extends React.Component {
  colourWasChanged(e) {
    console.log(e.target.value);
  }

  render() {
    return (
      <div className="group-form">
        <form method="POST" encType="multipart/form-data">
          <div className="group-image-upload">
            <DroppableImageField />
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
              onChangeFunction={this.colourWasChanged}
              wrapInForm={false} />
          </div>
          <br />

          <div className="group-form-submit-button">
            <input type="submit" value="OK"/>
          </div>
        </form>
      </div>
    );
  }
}

GroupForm.displayName = 'GroupForm';
