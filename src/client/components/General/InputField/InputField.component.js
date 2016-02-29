'use strict';

import React from 'react';

import './inputfield.component.scss';

export default function InputField({defaultValue, error, onChangeFunc, name, title, placeholder, type, required, disabled, autocomplete}) {
  return (
    <div className={name + '--form-area inputfield'}>
      <label>
        <p>
          <strong>{title}</strong>
        </p>
        <input
          required={required}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChangeFunc}
          disabled={disabled}
          autoComplete={autocomplete}
        />
        {error}
      </label>
    </div>
  );
}

InputField.displayName = 'InputField';
InputField.propTypes = {
  defaultValue: React.PropTypes.string.isRequired,
  error: React.PropTypes.any.isRequired,
  onChangeFunc: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  autocomplete: React.PropTypes.string
};

InputField.defaultProps = {
  defaultValue: '',
  error: '',
  onChangeFunc: () => {},
  name: '',
  title: '',
  placeholder: '',
  type: 'text',
  required: false,
  disabled: false,
  autocomplete: 'on'
};
