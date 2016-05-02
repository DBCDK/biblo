import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as searchActions from '../../Actions/search.actions';

import PageLayout from '../Layout/PageLayout.component.js';
import MaterialSearchResultList from './MaterialSearchResultList/MaterialSearchResultList.component.js';
import VisFlereButton from '../General/VisFlereButton/VisFlereButton.component.js';

import './SearchResultContainer.scss';


export class SearchResultContainer extends React.Component {

  constructor(props) {
    super(props);
    this.loadMoreResults = this.loadMoreResults.bind(this);
  }

  loadMoreResults() {
    this.props.searchActions.asyncLoadMoreResults(
      this.props.search.initialQuery,
      this.props.search.materialSearchResults.length + 10
    );
  }


  render() {
    return (
      <PageLayout searchState={this.props.search} searchActions={this.props.searchActions}>
        <MaterialSearchResultList results={this.props.search.materialSearchResults}/>
        <VisFlereButton onClick={this.loadMoreResults} isLoading={this.props.search.isLoadingResults}/>
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
