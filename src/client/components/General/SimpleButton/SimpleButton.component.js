import React from 'react';
import PropTypes from 'prop-types';

// sass
import './SimpleButton.component.scss';

export default class SimpleButton extends React.Component {
  onClick() {
    this.props.onClick();
  }

  render() {
    return (
      <div className="simple-button" onClick={this.onClick.bind(this)} >{this.props.text || 'this.props.text'}</div>
    );
  }
}

SimpleButton.displayName = 'SimpleButton';

SimpleButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func
};

SimpleButton.defaultProps = {
  onClick: () => {}
};
