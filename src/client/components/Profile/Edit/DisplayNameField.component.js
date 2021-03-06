import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import sanitizeHtml from './../../../Utils/sanitizeHtml.util';

import Message from '../../General/Message/Message.component';

let debouncedCheckDisplayNameFunction;

function onChange(onChangeFunc, checkDisplayNameFunction, e) {
  if (e.target.value !== '') {
    const sanitizedString = sanitizeHtml(e.target.value);

    if (!debouncedCheckDisplayNameFunction) {
      debouncedCheckDisplayNameFunction = debounce(checkDisplayNameFunction, 1000);
    }
    debouncedCheckDisplayNameFunction(sanitizedString);
  }

  onChangeFunc(e);
}

/**
 * @param {string} errors
 * @param {Function} onChangeFunc
 * @param {Function} checkDisplayNameFunction
 * @param {boolean} displayNameExists
 * @param {string} value
 * @return {*}
 */
export default function DisplayNameField({
  errors,
  onChangeFunc,
  checkDisplayNameFunction,
  displayNameExists,
  value,
  renderFieldExplanation
}) {
  return (
    <div className="display-name--form-area ">
      <div className="inputFieldTextContainer">
        <p>
          <strong>Vælg et brugernavn *</strong>
        </p>
        {renderFieldExplanation ? renderFieldExplanation : ''}
      </div>
      <label>
        <input
          className={displayNameExists ? 'error' : ''}
          id={'profile-displayname-input'}
          required
          name="displayname"
          value={value}
          placeholder="Dit brugernavn"
          onChange={onChange.bind(null, onChangeFunc, checkDisplayNameFunction)}
          onBlur={onChange.bind(null, onChangeFunc, checkDisplayNameFunction)}
        />
        {errors.displayname || ''}
        {displayNameExists ? (
          <Message type="error">
            <span>Brugernavnet er optaget!</span>
          </Message>
        ) : (
          ''
        )}
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
  value: PropTypes.string.isRequired,
  renderFieldExplanation: PropTypes.element
};

DisplayNameField.defaultProps = {
  defaultValue: '',
  errors: {},
  onChangeFunc: () => {},
  displayNameExists: false
};
