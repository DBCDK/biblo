import React from 'react';

import './inputfield.component.scss';

export default function InputField({defaultValue, error, onChangeFunc, name, title, placeholder, type, required, disabled, autocomplete = true}) {
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
          onBlur={onChangeFunc}
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
  defaultValue: React.PropTypes.string,
  error: React.PropTypes.any,
  onChangeFunc: React.PropTypes.func.isRequired,
  type: React.PropTypes.string,
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
