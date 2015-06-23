'use strict';
/**
 * @file
 * Currently the main entrypoint served on /search.
 * Provides the search functionality result view for the enduser.
 */
import React from 'react';
import QueryParser from '../../utils/QueryParser.util.js';
import {isEmpty} from 'lodash';

// import components
import AutoComplete from 'dbc-react-autocomplete';
import {TokenSearchField, FilterGuide} from 'dbc-react-querystring';
import {ResultDisplay} from 'dbc-react-resultlistview';
import SearchTabs from './SearchTabs.component.js';
import Loader from '../Loader.component.js';
// import reflux actions and stores
import AutoCompleteActions from '../../actions/AutoComplete.action.js';
import AutoCompleteStore from '../../stores/AutoComplete.store.js';
import queryAction from '../../actions/QueryUpdate.action.js';
import recommendationsAction from '../../actions/Recommendations.action.js';
import recommendationsStore from '../../stores/Recommendations.store.js';
import queryStore from '../../stores/QueryStore.store.js';
import filterStore from '../../stores/FilterStore.store.js';
import resultListStore from '../../stores/ResultList.store.js';
import coverImageStore from '../../stores/CoverImage.store.js';

const defaultRecommendations = [
  '870970-basis:51263146',
  '870970-basis:51115155',
  '870970-basis:28394438',
  '870970-basis:22629344',
  '870970-basis:25915690',
  '870970-basis:24929604',
  '870970-basis:27796664',
  '870970-basis:26588707',
  '870970-basis:23372525',
  '870970-basis:28280041',
  '870970-basis:51342860',
  '870970-basis:28290853'
];

/**
 * Search field wrapper component
 */
const Search = React.createClass({
  timer: null,

  propTypes: {
    query: React.PropTypes.object,
    filterElements: React.PropTypes.array,
    resultList: React.PropTypes.array,
    recommendations: React.PropTypes.array,
    selected: React.PropTypes.string,
    coverImages: React.PropTypes.object
  },

  getInitialState() {
    const query = QueryParser.stringToObject(this.props.query || []);
    queryAction(query);
    return {
      query,
      filterElements: this.props.filterElements || [],
      resultList: resultListStore.getStore(),
      coverImages: {images: new Map()},
      recommendations: recommendationsStore.getStore(),
      selected: null
    };
  },

  /**
   * Add a single element to the Query array
   */
  addElementToQuery(element) {
    let query = this.state.query;
    query.push(element);
    queryAction(query);
  },

  /**
   * Update the Query with a new Query
   */
  updateQuery(query) {
    this.setState({query});

    // this is a simple way of handling updates of the url
    // we might need to implement a more advanced version at some point e.g. react-router
    // but we need to figure out our needs first
    history.pushState(null, null, `${window.location.pathname}?${QueryParser.objectToString(query)}`);
  },

  updateFilters(filterElements) {
    this.setState({filterElements});
  },

  updateResultList(resultList) {
    if (resultList && resultList.result) {
      recommendationsAction(resultList.result.map(element => element.identifiers[0]));
    }
    this.setState({resultList});
  },

  updateRecommendations(recommendations) {
    this.setState({recommendations});
  },

  updateCoverImages(coverImages) {
    this.setState({coverImages});
  },

  updateSelected(selected) {
    this.setState({selected});
  },

  componentDidMount: function () {
    AutoCompleteStore.listen(this.updateAutoComplete);
    queryStore.listen(this.updateQuery);
    filterStore.listen(this.updateFilters);
    resultListStore.listen(this.updateResultList);
    coverImageStore.listen(this.updateCoverImages);
    recommendationsStore.listen(this.updateRecommendations);
    if (this.state.query.length === 0) {
      recommendationsAction(defaultRecommendations);
    }
  },

  updateAutoComplete(autoCompleteData) {
    this.setState({autoCompleteData: autoCompleteData});
  },

  /**
   * Callback for the text input (TokenSearchField)
   */
    onChange(textFieldValue) {
    this.setState({textFieldValue: textFieldValue});
    this.requestSuggestions();
  },

  requestSuggestions() {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      AutoCompleteActions.textfieldUpdated(this.state.textFieldValue);
    }, 150);
  },

  getView() {
    const {query, selected} = this.state;
    return query.length === 0 && 'Anbefalinger' || selected;
  },

  render() {
    const {query, filterElements, resultList, recommendations, coverImages} = this.state;
    const autoCompleteData = this.state.autoCompleteData || {};
    const textFieldValue = this.state.textFieldValue || '';
    const autoCompleteVisible = (!isEmpty(autoCompleteData) && !isEmpty(textFieldValue));
    const view = this.getView();
    const results = (view === 'Anbefalinger') && recommendations || resultList;

    let filterGuide;
    let searchTabs;

    if (filterElements.length) {
      filterGuide = <FilterGuide elements={filterElements} select={this.addElementToQuery} />;
    }
    if (resultList.result.length) {
      searchTabs = <SearchTabs
        buttons={['Søgeresultat', 'Anbefalinger']}
        selected={view}
        update={this.updateSelected}
        />;
    }

    return (
      <div className='search'>
        <TokenSearchField query={query} update={queryAction} change={this.onChange} />
        <AutoComplete data={autoCompleteData} visible={autoCompleteVisible} />
        {filterGuide}
        <div className='search-result'>
          {searchTabs}
          <Loader pending={results.pending}>
            <ResultDisplay result={results.result} coverImages={coverImages.images}>
              <div className='no-results'>Søgningen gav ingen resultater</div>
            </ResultDisplay>
          </Loader>
        </div>
      </div>
    );
  }
});

export default Search;
