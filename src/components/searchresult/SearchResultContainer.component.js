'use strict';

/**
 * @file
 * Container for the Search Result
 */

import React from 'react';
import Reflux from 'reflux';

// Components
import SearchResultList from './SearchResultList.component.js';
import DefaultRecommendations from '../recommendations/DefaultRecommendationsContainer.component.js';
import Tabs from '../tabs/Tabs.component.js';

// Actions
import RecommendationActions from '../../actions/Recommendations.action.js';
import QueryActions from '../../actions/QueryUpdate.action.js';

// Stores
import ResultListStore from '../../stores/ResultList.store.js';
import RecommendationStore from '../../stores/Recommendations.store.js';
import QueryStore from '../../stores/QueryStore.store.js';

export default React.createClass({
  displayName: 'SearchResultContainer.component',

  propTypes: {
    config: React.PropTypes.object
  },

  mixins: [
    Reflux.listenTo(ResultListStore, 'updateRecommendations'),
    Reflux.connect(ResultListStore, 'results'),
    Reflux.connect(RecommendationStore, 'recommendations'),
    Reflux.connect(QueryStore, 'query')
  ],

  updateRecommendations(data) {
    RecommendationActions.request(data.result.map(element => element.identifiers[0]));
  },

  renderSearchResult() {
    const tabs = [];
    tabs.push({
      label: 'Søgeresultat',
      component:
        <SearchResultList actions={QueryActions} config={this.props.config} data={{results: this.state.results}} />,
      active: true
    });
    tabs.push({
      label: 'Anbefalinger',
      component:
        <SearchResultList actions={QueryActions} config={this.props.config} data={{results: this.state.recommendations}} />,
      active: false
    });

    return (
      <Tabs defaultSelected={0} tabs={tabs} />
    );
  },

  renderDefaultRecommendations() {
    return (
      <DefaultRecommendations actions={QueryActions} config={this.props.config} data={{recommendations: this.state.recommendations}} />
    );
  },

  render() {
    const result = this.state.query.query.length && this.renderSearchResult() || this.renderDefaultRecommendations();

    return (
      <div className='search-result' >
        {result}
      </div>
    );
  }
});
