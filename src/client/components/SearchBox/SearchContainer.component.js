import React from 'react';
import ReactDOM from 'react-dom';

import Icon from '../General/Icon/Icon.component.js';
import {SearchDropDown} from './SearchDropDown/SearchDropDown.component';
import searchSvg from '../General/Icon/svg/functions/search.svg';
import spinnerSvg from '../General/Icon/svg/spinners/loading-spin.svg';

import {hideKeyboard} from '../../Utils/keyboard.utils';

import './search-container.scss';

export default class SearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: this.props.search.query,
      qChanged: false,
      queryFieldIsActive: false,
      loading: false,
      searchPlaceholder: ''
    };
    this.searchInputChanged = this.searchInputChanged.bind(this);
    this.submitInput = this.submitInput.bind(this);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount() {
    const self = this;

    window.addEventListener('scroll', function () {
      if (self.state.qChanged) {
        self.setState({qChanged: false});
        hideKeyboard(ReactDOM.findDOMNode(self.refs.searchFieldReference));
      }
    });

    window.addEventListener('keydown', function (e) {
      if (self.state.queryFieldIsActive || self.state.suggestionMenuItemActive) {
        e = e || window.event;
        let charCode = (typeof e.which === 'number') ? e.which : e.keyCode;
        switch (charCode) {
          case 40:
            self.props.searchActions.selectNextSuggestedElement();
            break;
          case 38:
            self.props.searchActions.selectPreviousSuggestedElement();
            break;
          default:
            break;
        }
      }
    });

    if (typeof window !== 'undefined' && Math.max(document.documentElement.clientWidth, window.innerWidth) < 600) {
      self.setState({searchPlaceholder: 'Søg her'});
    }
    else {
      self.setState({searchPlaceholder: 'Søg på bøger, film, musik, spil og grupper'});
    }
  }

  componentDidUpdate() {
    if (this.props.search.setFocusOnSearchBox) {
      this.props.search.setFocusOnSearchBox = false;
      ReactDOM.findDOMNode(this.refs.searchFieldReference).focus();
    }
  }

  searchInputChanged(e) {
    const query = e.target.value;
    this.setState({query: query, qChanged: true});
    this.props.searchActions.searchQueryHasChanged(query);

    // ask for suggestions
    if (query.length >= 3) {
      this.props.searchActions.getWorkSuggestions(query);
    }
  }

  clearSearchBox() {
    this.setState({query: ''});
  }

  submitInput(e) {
    if (e.keyCode === 13 && this.props.search.selectedWorkSuggestion >= 0) {
      window.location = this.props.search.workSuggestions[this.state.query][this.props.search.selectedWorkSuggestion].href;
    }
    else if (e.type === 'click' || e.keyCode === 13) {
      this.setState({loading: true});
      this.props.searchActions.search({
        query: this.state.query,
        groupFilter: this.props.search.filters.groupFilter,
        materialFilters: this.props.search.filters.materialFilters,
        subjects: this.props.search.filters.subjectFilters
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
            href: suggestion.href,
            active: suggestion.active || false,
            type: suggestion.type
          };
        })}
      />
    );

    const searchButtonGlyph = (this.props.search.isSearching) ? spinnerSvg : searchSvg;
    const clearSearchBoxVisible = 'search-container--clear-searchbox ' + (this.state.query.length > 0 ? '' : 'clear-searchbox-hidden');
    return (
      <div className='search'>
        <div className={classNames}>
          <div className="searchbox--container">
            <a className='search-container--search-button' href='#' onClick={this.submitInput}>
              <Icon glyph={searchButtonGlyph} width={24} height={24}/>
            </a>
            <span className="search-input--container">
              <input
                type='search'
                placeholder={this.state.searchPlaceholder}
                value={this.state.query}
                onChange={this.searchInputChanged}
                onKeyDown={this.submitInput}
                onBlur={() => this.setState({queryFieldIsActive: false})}
                onFocus={() => this.setState({queryFieldIsActive: true})}
                ref="searchFieldReference"
              >
              </input>
              <span className={clearSearchBoxVisible} onClick={this.clearSearchBox}>×</span>
              <div className="search-container--dropdown-container">
                {dropDown}
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

SearchContainer.displayName = 'SearchContainer';

SearchContainer.propTypes = {
  search: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  searchPlaceholder: React.PropTypes.string
};
