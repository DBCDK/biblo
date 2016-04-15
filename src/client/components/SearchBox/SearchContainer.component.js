import React from 'react';

import Icon from '../General/Icon/Icon.component.js';
import searchSvg from '../General/Icon/svg/functions/search.svg';

import './search-container.scss';

export default class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="search-container">
        <input type='search' placeholder='Søg på Bøger, film og spil' ></input>
        <a className='search-container--search-button' href='#'><Icon glyph={searchSvg} width={24} height={24} /></a>
      </div>
    );
  }
}

SearchContainer.displayName = 'SearchContainer';
