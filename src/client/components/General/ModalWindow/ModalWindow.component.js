'use strict';

import React from 'react';
import {PropTypes} from 'react';

import Icon from '../Icon/Icon.component';
import closeSvg from '../Icon/svg/functions/close.svg';

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
            <div className="modal-window--close-button--container">
              <span onClick={this.props.onClose} className="modal-window--close-button">
                <Icon glyph={closeSvg} />
              </span>
            </div>
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
