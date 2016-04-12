import React from 'react';
import {debounce} from 'lodash';

import Message from '../../General/Message/Message.component';

let debouncedCheckDisplayNameFunction;

function onChange(onChangeFunc, checkDisplayNameFunction, e) {
  if (e.target.value !== '') {
    if (!debouncedCheckDisplayNameFunction) {
      debouncedCheckDisplayNameFunction = debounce(checkDisplayNameFunction, 1000);
    }
    debouncedCheckDisplayNameFunction(e.target.value);
    onChangeFunc(e);
  }
}

export default function DisplayNameField({defaultValue, errors, onChangeFunc, checkDisplayNameFunction, displayNameExists}) {
  return (
    <div className="display-name--form-area">
      <label>
        <p>
          <strong>Vælg et brugernavn</strong>
        </p>
        <input
          className={displayNameExists ? 'error' : ''}
          required
          name="displayname"
          placeholder="Dit brugernavn"
          defaultValue={defaultValue}
          onChange={onChange.bind(null, onChangeFunc, checkDisplayNameFunction)}
          onBlur={onChange.bind(null, onChangeFunc, checkDisplayNameFunction)}
        />
        {errors.displayname || ''}
        {displayNameExists ? <Message type="error"><span>Brugernavnet er optaget!</span></Message> : ''}
      </label>
    </div>
  );
}

DisplayNameField.displayName = 'DisplayNameField';

DisplayNameField.propTypes = {
  defaultValue: React.PropTypes.string.isRequired,
  errors: React.PropTypes.object.isRequired,
  onChangeFunc: React.PropTypes.func.isRequired,
  checkDisplayNameFunction: React.PropTypes.func.isRequired,
  displayNameExists: React.PropTypes.bool
};

DisplayNameField.defaultProps = {
  defaultValue: '',
  errors: {},
  onChangeFunc: () => {},
  displayNameExists: false
};
