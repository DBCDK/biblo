import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as searchActions from '../../Actions/search.actions';

import PageLayout from '../Layout/PageLayout.component.js';
import SearchFilters from '../SearchBox/SearchFilters/SearchFilters.component.js';
import MaterialSearchResultList from './MaterialSearchResultList/MaterialSearchResultList.component.js';
import VisFlereButton from '../General/VisFlereButton/VisFlereButton.component.js';

import './SearchResultContainer.scss';


export class SearchResultContainer extends React.Component {

  constructor(props) {
    super(props);
    this.loadMoreResults = this.loadMoreResults.bind(this);
  }

  loadMoreResults() {
    this.props.searchActions.asyncLoadMoreResults({
      query: this.props.search.initialQuery,
      materialFilters: this.props.search.filters.materialFilters,
      subjects: this.props.search.filters.subjectFilters,
      offset: this.props.search.materialSearchOffset + 20
    });
  }

  render() {
    let visFlereButton;
    if (this.props.search.materialSearchResults.length >= (this.props.search.materialSearchOffset + 20)) { // limit: 20 (we currently do not collect the total number of results)
      visFlereButton = <VisFlereButton onClick={this.loadMoreResults} isLoading={this.props.search.isLoadingResults}/>;
    }

    return (
      <PageLayout searchState={this.props.search} searchActions={this.props.searchActions}>
        <SearchFilters search={this.props.search} searchActions={this.props.searchActions} />
        <MaterialSearchResultList results={this.props.search.materialSearchResults}/>
        {visFlereButton}
      </PageLayout>
    );
  }
}

SearchResultContainer.displayName = 'SearchResultContainer';

SearchResultContainer.propTypes = {
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
)(SearchResultContainer);
