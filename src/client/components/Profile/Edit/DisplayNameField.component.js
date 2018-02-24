import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import sanitizeHtml from './../../../Utils/sanitizeHtml.util';

import Message from '../../General/Message/Message.component';

let debouncedCheckDisplayNameFunction;

function onChange(onChangeFunc, checkDisplayNameFunction, e) {
  const sanitizedString = sanitizeHtml(e.target.value);
  if (sanitizedString !== '') {
    if (!debouncedCheckDisplayNameFunction) {
      debouncedCheckDisplayNameFunction = debounce(checkDisplayNameFunction, 1000);
    }
    debouncedCheckDisplayNameFunction(sanitizedString);
  }
  onChangeFunc(e);
}

export default function DisplayNameField({errors, onChangeFunc, checkDisplayNameFunction, displayNameExists, value}) {
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
          value={value}
          placeholder="Dit brugernavn"
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
  errors: PropTypes.object.isRequired,
  onChangeFunc: PropTypes.func.isRequired,
  checkDisplayNameFunction: PropTypes.func.isRequired,
  displayNameExists: PropTypes.bool,
  value: PropTypes.string.isRequired
};

DisplayNameField.defaultProps = {
  defaultValue: '',
  errors: {},
  onChangeFunc: () => {},
  displayNameExists: false
};
