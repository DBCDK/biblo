import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as searchActions from '../../Actions/search.actions';

import Icon from '../General/Icon/Icon.component.js';
import searchSvg from '../General/Icon/svg/functions/search.svg';

import './search-container.scss';

export class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const classNames = (this.props.search.isVisible) ? 'search-container' : 'search-container search-container--hidden';

    return (
      <div className={classNames}>
        <input type='search' placeholder='Søg på bøger, film og spil' ></input>
        <a className='search-container--search-button' href='#'><Icon glyph={searchSvg} width={24} height={24} /></a>
      </div>
    );
  }
}

SearchContainer.displayName = 'SearchContainer';

SearchContainer.propTypes = {
  search: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to props
  (state) => {
    return {
      search: state.searchReducer
    };
  },

  // Map actions to props
  (dispatcher) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatcher)
    };
  }
)(SearchContainer);
