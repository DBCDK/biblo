import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as searchActions from '../../Actions/search.actions';

import PageLayout from '../Layout/PageLayout.component.js';
import MaterialSearchResultList from './MaterialSearchResultList/MaterialSearchResultList.component.js';

import './SearchResultContainer.scss';


export class SearchResultContainer extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <PageLayout>
        <MaterialSearchResultList results={this.props.search.materialSearchResults}/>
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
