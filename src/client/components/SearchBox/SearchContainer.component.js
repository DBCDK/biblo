import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as searchActions from '../../Actions/search.actions';

import Icon from '../General/Icon/Icon.component.js';
import SearchDropDown from '../General/SearchDropDown/SearchDropDown.component';
import searchSvg from '../General/Icon/svg/functions/search.svg';

import './search-container.scss';

export class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
    this.searchInputChanged = this.searchInputChanged.bind(this);
    this.submitInput = this.submitInput.bind(this);
  }


  searchInputChanged(e) {
    const query = e.target.value;
    this.setState({query: query});

    // ask for suggestions
    if (query.length >= 3) {
      this.props.searchActions.getWorkSuggestions(query);
    }
  }

  submitInput(e) {
    if (e.type === 'click' || e.keyCode === 13) {
      searchActions.searchMaterials({
        query: this.state.query
      });
    }
  }

  render() {
    const classNames = (this.props.search.isSearchBoxVisible) ? 'search-container' : 'search-container search-container--hidden';
    const dropDown = (
      <SearchDropDown
        visible={
          this.state.query.length >= 3 &&
          this.props.search.workSuggestions[this.state.query] &&
          this.props.search.workSuggestions[this.state.query].length > 0 || false
          }
        elements={(this.props.search.workSuggestions[this.state.query] || []).map((suggestion) => {
          return {
            text: suggestion.str,
            clickFunc: () => {
              window.location = suggestion.href;
            },
            href: suggestion.href
          };
        })}
      />
    );

    return (
      <div className={classNames}>
        <div>
          <input
            type='search'
            placeholder='Søg på bøger, film og spil'
            defaultValue={this.props.search.initialQuery}
            onChange={this.searchInputChanged}
            onKeyDown={this.submitInput}
          />
          <a className='search-container--search-button' href='#' onClick={this.submitInput}>
            <Icon glyph={searchSvg} width={24} height={24}/>
          </a>
          <div className="search-dropdown--container">
            {dropDown}
          </div>
        </div>
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
