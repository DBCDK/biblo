import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat small/book_no_border.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat small/game_no_border.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat small/music_no_border.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat small/film_no_border.svg';

import './SearchFilters.component.scss';


const filterIcons = {
  book: {
    svg: bookSvg
  },
  audiobook: {
    svg: audiobookSvg
  },
  movie: {
    svg: movieSvg
  },
  music: {
    svg: musicSvg
  },
  game: {
    svg: gameSvg
  }
};

export default class SearchFilters extends React.Component {

  constructor(props) {
    super(props);
    this.resetFilters = this.resetFilters.bind(this);
  }

  resetFilters() {
    this.props.searchActions.resetMaterialFilters();
  }

  render() {

    const filters = this.props.search.filters.materialFilters;

    const filterElements = Object.keys(filterIcons).map((key) => {
      const clickFunction = () => {
        this.props.searchActions.toggleMaterialFilter(key);
        this.props.searchActions.searchMaterials({
          query: this.props.search.query,
          materialFilters: this.props.search.filters.materialFilters
        });
      };
      const activeClass = (filters[key].enabled) ? 'search-filters--button-active' : '';
      return (<li key={key} className={'search-filters--button ' + activeClass} onClick={clickFunction}><Icon width={36}
                                                                                                              height={36}
                                                                                                              glyph={filterIcons[key].svg}/>
      </li>);
    });

    return (
      <ul className='search-filters'>
        {filterElements}
        <a className='search-filters--reset-button' href='#' onClick={this.resetFilters}>nulstil</a>
      </ul>
    );
  }
}

SearchFilters.displayName = 'SearchFilters';

SearchFilters.propTypes = {
  search: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired
};
