'use strict';

import React from 'react';

import './searchdropdown.component.scss';

export default function SearchDropDown({visible, elements}) {
  elements = elements.map((element) => {
    return (
      <li className="searcharea--dropdown--list--item" onClick={element.clickFunc} key={element.text}>
        {element.text}
      </li>
    );
  });

  return (
    <div className="search-area--dropdown" style={{display: visible ? 'block' : 'none'}}>
      <ul className="searcharea--dropdown--list">
        {elements}
      </ul>
    </div>
  );
}

SearchDropDown.displayName = 'SearchDropDown';

SearchDropDown.propTypes = {
  visible: React.PropTypes.bool,
  elements: (props, propName) => {
    let prop = props[propName];
    if (!Array.isArray(prop)) {
      return new Error('Elements must be an array!');
    }
    prop.forEach((element) => {
      if (!element.text) {
        return new Error('Each element must contain text!');
      }

      if (!element.clickFunc) {
        return new Error('Each element must have a changeFunc!');
      }
    });
  }
};

SearchDropDown.defaultProps = {
  visible: true,
  elements: []
};
