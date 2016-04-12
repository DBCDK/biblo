import React from 'react';
import Icon from '../../General/Icon/Icon.component';

// svgs
import closeSvg from '../../General/Icon/svg/functions/close.svg';

// scss
import './Message.scss';

export default function Message({children, type, onClose}) {
  return (
    <div className={`message ${type}`}>
      {children}
      {onClose &&
      <a href="#removeMessage" className="message--close" onClick={(e) => onClose(e)}><Icon glyph={closeSvg}/></a>
      }
    </div>
  );
}

Message.propTypes = {
  children: React.PropTypes.any.isRequired,
  onClose: React.PropTypes.func,
  type: React.PropTypes.string.isRequired
};
