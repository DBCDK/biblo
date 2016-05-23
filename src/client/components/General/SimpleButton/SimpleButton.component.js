import React from 'react';

// sass
import './SimpleButton.component.scss';

export default class SimpleButton extends React.Component {
  render() {
    return (
      <div className="simple-button">{this.props.text || 'this.props.text'}</div>
    );
  }
}

SimpleButton.displayName = 'SimpleButton';

SimpleButton.propTypes = {
  text: React.PropTypes.string,
  callback: React.PropTypes.func
};
