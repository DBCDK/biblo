import React from 'react';

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
          />
          {this.props.error}
        </label>
      </div>
    );
  }
}

InputField.displayName = 'InputField';
InputField.propTypes = {
  defaultValue: React.PropTypes.string,
  error: React.PropTypes.any,
  onChangeFunc: React.PropTypes.func.isRequired,
  type: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  autocomplete: React.PropTypes.string,
  dateFormat: React.PropTypes.string
};

InputField.defaultProps = {
  defaultValue: '',
  error: '',
  onChangeFunc: () => {},
  name: 'standard',
  title: '',
  placeholder: '',
  type: 'text',
  required: false,
  disabled: false,
  autocomplete: 'on'
};
