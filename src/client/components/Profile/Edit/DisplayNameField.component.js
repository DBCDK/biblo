'use strict';

import React from 'react';

export default function DisplayNameField({defaultValue, errors, onChangeFunc}) {
  return (
    <div className="display-name--form-area">
      <label>
        <p>
          <strong>Vælg et brugernavn</strong>
        </p>
        <input
          required
          name="displayname"
          placeholder="Dit brugernavn"
          defaultValue={defaultValue}
          onChange={onChangeFunc}
        />
        {errors.displayname || ''}
      </label>
    </div>
  );
}

DisplayNameField.displayName = 'DisplayNameField';
DisplayNameField.propTypes = {
  defaultValue: React.PropTypes.string.isRequired,
  errors: React.PropTypes.object.isRequired,
  onChangeFunc: React.PropTypes.func.isRequired
};
DisplayNameField.defaultProps = {
  defaultValue: '',
  errors: {},
  onChangeFunc: () => {}
};
