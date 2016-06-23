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

  loadMoreGroupResults () {
    this.props.searchActions.asyncLoadMoreGroupResults({
      query: this.props.search.initialQuery,
      limit: this.props.search.groupSearchLimit,
      from: this.props.search.groupSearchOffset + this.props.search.groupSearchLimit
    });
  }

  render() {
    let visFlereMaterialButton, visFlereGroupButton;

    if (this.props.search.materialSearchResults.length - this.props.search.materialSearchOffset >=
      this.props.search.materialSearchLimit
    ) {
      visFlereMaterialButton = <VisFlereButton onClick={this.loadMoreMaterialResults} isLoading={this.props.search.isLoadingMaterialResults}/>;
    }

    if (this.props.search.groupSearchResults.length - this.props.search.groupSearchOffset >=
         this.props.search.groupSearchLimit
    ) {
      visFlereGroupButton = <VisFlereButton onClick={this.loadMoreGroupResults} isLoading={this.props.search.isLoadingGroupResults}/>;
    }

    return (
      <PageLayout searchState={this.props.search} searchActions={this.props.searchActions} profileState={this.props.profileState}>
        <SearchFilters search={this.props.search} searchActions={this.props.searchActions} />

        <MaterialSearchResultList results={this.props.search.materialSearchResults}/>
        {visFlereMaterialButton}
        <GroupSearchResultList results={this.props.search.groupSearchResults}/>
        {visFlereGroupButton}

      </PageLayout>
    );
  }
}


SearchResultContainer.displayName = 'SearchResultContainer';

SearchResultContainer.propTypes = {
  profileState: React.PropTypes.object.isRequired,
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
      profileState: state.profileReducer,
      search: state.searchReducer
    };
  },

  // Map actions to props
  (dispatcher) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatcher)
    };
  }
)(SearchResultContainer);
