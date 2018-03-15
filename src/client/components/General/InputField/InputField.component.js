import React from 'react';
import PropTypes from 'prop-types';

import './inputfield.component.scss';

export class InputField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.name + '--form-area inputfield'}>
        <label>
          <p>
            <strong>{this.props.title}</strong>
          </p>
          <input
            id={this.props.id}
            required={this.props.required}
            name={this.props.name}
            type={this.props.type}
            placeholder={this.props.placeholder}
            defaultValue={this.props.defaultValue}
            onChange={this.props.onChangeFunc}
            onBlur={this.props.onChangeFunc}
            disabled={this.props.disabled}
            autoComplete={this.props.autocomplete}
            lang="da"
            data-date-format={this.props.dateFormat}
            pattern={this.props.pattern}
          />
          {this.props.error}
        </label>
      </div>
    );
  }
}

InputField.displayName = 'InputField';
InputField.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.any,
  onChangeFunc: PropTypes.func.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.string,
  dateFormat: PropTypes.string,
  pattern: PropTypes.string
};

InputField.defaultProps = {
  defaultValue: '',
  error: '',
  onChangeFunc: () => {},
  name: 'standard',
  id: '',
  title: '',
  placeholder: '',
  type: 'text',
  required: false,
  disabled: false,
  autocomplete: 'on',
  pattern: '*'
};
