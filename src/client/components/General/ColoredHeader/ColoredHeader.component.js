import React from 'react';

import Icon from '../Icon/Icon.component.js';

import './colored-header.scss';

function ColoredHeader({color = null, text = 'Test tekst.', iconGlyph=null, title='title'}) {

  // Use inline styles to simplify radically.
  let style = {
    color: color
  };

  return (
    <div className="colored-header" style={style}>
      <div className="colored-header--iconcontainer">
        <Icon className="icon" height={100} width={100} glyph={iconGlyph}/>
      </div>
      <div className="colored-header--description">
        <div className="colored-header--text">
          <h2>{title}</h2>
          {text}
        </div>
      </div>
    </div>
  );
}

ColoredHeader.displayName = 'ColoredHeader';

ColoredHeader.propTypes = {
  color: React.PropTypes.string,
  iconGlyph: React.PropTypes.any,
  text: React.PropTypes.string,
  title: React.PropTypes.string
};

export default ColoredHeader;
