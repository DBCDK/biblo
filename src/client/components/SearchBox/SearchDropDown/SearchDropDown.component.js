import React from 'react';

import './searchdropdown.component.scss';

export class SearchDropDown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.elements);
    const elements = this.props.elements.map((element) => {
      element.clickFunc = element.clickFunc || (() => {});
      element.href = element.href || '#!';

      let itemClasses = `searcharea--dropdown--list--item ${element.type}`;

      if (element.active) {
        itemClasses += ' searcharea--dropdown--list--item--active';
      }

      return (
        <li className={itemClasses} onClick={element.clickFunc} key={element.text}>
          <div>
            <a href={element.href} className="search-area--dropdown--link">
              {element.text}
            </a>
          </div>
        </li>
      );
    });

    return (
      <div className="search-area--dropdown" style={{display: this.props.visible ? 'block' : 'none'}}>
        <ul className="searcharea--dropdown--list">
          {elements}
        </ul>
      </div>
    );
  }

}

SearchDropDown.displayName = 'SearchDropDown';
SearchDropDown.propTypes = {
  visible: React.PropTypes.bool,
  elements: (props, propName) => { // eslint-disable-line consistent-return
    const prop = props[propName];
    if (!Array.isArray(prop)) {
      return new Error('Elements must be an array!');
    }
    prop.forEach((element) => { // eslint-disable-line consistent-return
      if (!element.text) {
        return new Error('Each element must contain text!');
      }

      if (!element.clickFunc || !element.href) {
        return new Error('Each element must have a changeFunc or href!');
      }
    });
  }
};

SearchDropDown.defaultProps = {
  visible: true,
  elements: []
};
