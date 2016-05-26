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
    let title = '';

    if (this.props.title) {
      title = (<h2>{this.props.title}</h2>);
    }

    return (
      <div className="modal-window--overlay" onClick={this.props.onClose}>
        <div className="modal-window--window" onClick={(e) => {
          e.stopPropagation();
        }}>
          <div className="modal-window--overhead-title">
            {title}
          </div>
          <div className="modal-window--content-container">
            <div>
              <div className="modal-window--close-button--container">
                <span onClick={this.props.onClose} className="modal-window--close-button">
                  <Icon glyph={closeSvg} />
                </span>
              </div>
            </div>
            <div className="modal-window--content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ModalWindow.propTypes = {
  children: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
};
