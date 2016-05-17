import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat small/book_no_border.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat small/game_no_border.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat small/music_no_border.svg';
import audiobookSvg from '../../General/Icon/svg/Materialikon-kvadrat small/audiobook_no_border.svg';
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
  }

  render() {

    const filters = this.props.search.filters.materialFilters;

    const filterElements = Object.keys(filterIcons).map((key) => {
      const clickFunction = () => {
        this.props.searchActions.toggleMaterialFilter(key);
      };
      const activeClass = (filters[key].enabled) ? 'search-filters--button-active' : '';
      return (<li className={'search-filters--button ' + activeClass} onClick={clickFunction}><Icon width={36} height={36} glyph={filterIcons[key].svg}/></li>);
    });


    return (
      <ul className='search-filters'>
        {filterElements}
      </ul>
    );
  }
}

SearchFilters.displayName = 'SearchFilters';

SearchFilters.propTypes = {
  search: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired
};
