import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as searchActions from '../../Actions/search.actions';

import PageLayout from '../Layout/PageLayout.component.js';
import SearchFilters from '../SearchBox/SearchFilters/SearchFilters.component.js';
import MaterialSearchResultList from './MaterialSearchResultList/MaterialSearchResultList.component.js';
import GroupSearchResultList from './GroupSearchResultList/GroupSearchResultList.component.js';
import VisFlereButton from '../General/VisFlereButton/VisFlereButton.component.js';

import './SearchResultContainer.scss';

export class SearchResultContainer extends React.Component {

  constructor(props) {
    super(props);
    this.loadMoreMaterialResults = this.loadMoreMaterialResults.bind(this);
    this.loadMoreGroupResults = this.loadMoreGroupResults.bind(this);
  }

  loadMoreMaterialResults() {
    this.props.searchActions.asyncLoadMoreMaterialResults({
      query: this.props.search.initialQuery,
      materialFilters: this.props.search.filters.materialFilters,
      subjects: this.props.search.filters.subjectFilters,
      limit: this.props.search.materialSearchLimit,
      offset: this.props.search.materialSearchOffset + this.props.search.materialSearchLimit
    });
  }

  loadMoreGroupResults() {
    this.props.searchActions.asyncLoadMoreGroupResults({
      query: this.props.search.initialQuery,
      limit: this.props.search.groupSearchLimit,
      from: this.props.search.groupSearchOffset + this.props.search.groupSearchLimit
    });
  }

  shouldRenderMaterialResults() {
    return (
      !this.isFiltering()                     // display everything when not filtering
      || (!this.isGroupFilterEnabled()         // do not show material list when group filter is on
      || this.isMaterialFilterEnabled())       // show material list when material filter is on
    );
  }

  shouldRenderGroupResults() {
    return (
      !this.isFiltering()                     // display everything when not filtering
      || this.isGroupFilterEnabled()           // show group list when group filter is on
    );
  }

  isFiltering() {
    return (
      this.isGroupFilterEnabled() || this.isMaterialFilterEnabled()
    );
  }

  isGroupFilterEnabled() {
    return this.props.search.filters.groupFilter;
  }

  isMaterialFilterEnabled() {
    let materialFilterEnabled = false;
    for (let materialFilter in this.props.search.filters.materialFilters) {
      if (materialFilter) {
        materialFilterEnabled = materialFilterEnabled || this.props.search.filters.materialFilters[materialFilter].enabled;
      }
    }
    return materialFilterEnabled;
  }

  renderVisFlereMaterialButton(search) {
    if (search.isLoadingMaterialResults ||
      (search.materialSearchResults.length - search.materialSearchOffset >= search.materialSearchLimit)) {
      return (
        <VisFlereButton
          id='moreMaterialsButton'
          onClick={this.loadMoreMaterialResults}
          isLoading={search.isLoadingMaterialResults}/>
      );
    }
    return null;
  }

  renderVisFlereGroupButton(search) {
    if (search.isLoadingGroupResults ||
      (search.groupSearchResults.length - search.groupSearchOffset >= search.groupSearchLimit)) {
      return (
        <VisFlereButton
          id='moreGroupsButton'
          onClick={this.loadMoreGroupResults}
          isLoading={search.isLoadingGroupResults}/>
      );
    }
    return null;
  }

  render() {
    return (
      <PageLayout searchState={this.props.search} searchActions={this.props.searchActions} profileState={this.props.profileState} globalState={this.props.globalState} >
      <SearchFilters search={this.props.search} searchActions={this.props.searchActions}/>

        {
          this.shouldRenderMaterialResults() &&
          <div>
            <MaterialSearchResultList results={this.props.search.materialSearchResults}/>
            <div className="search-result-show-more-button">
              {this.renderVisFlereMaterialButton(this.props.search)}
            </div>
          </div>
        }

        {
          this.shouldRenderGroupResults() &&
          <div>
            <GroupSearchResultList results={this.props.search.groupSearchResults}/>
            <div className="search-result-show-more-button">
              {this.renderVisFlereGroupButton(this.props.search)}
            </div>
          </div>
        }

      </PageLayout>
    );
  }
}

SearchResultContainer.displayName = 'SearchResultContainer';

SearchResultContainer.propTypes = {
  profileState: React.PropTypes.object.isRequired,
  search: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  globalState: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to props
  (state) => {
    return {
      profileState: state.profileReducer,
      search: state.searchReducer,
      globalState: state.globalReducer
    };
  },

  // Map actions to props
  (dispatcher) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatcher)
    };
  }
)(SearchResultContainer);
