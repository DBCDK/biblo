'use strict';

import React from 'react';
import {PropTypes} from 'react';

import './modal-window.scss';

export default class ModalWindow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal-window--overlay" onClick={this.props.onClose}>
        <div className="modal-window--window" onClick={(e) => {
          e.stopPropagation();
        }}>
          <div className="modal-window--content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

ModalWindow.propTypes = {
  children: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired
};
