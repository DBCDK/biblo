/**
 * @file
 * Testing the SearchResultContainer
 */

import React from 'react';
import {assert} from 'chai';
import {lessThan20SearchResults, harrySearchResults} from '../../__mocks__/searchresults.mock.js';
import sd from 'skin-deep';
import {SearchResultContainer} from '../SearchResultContainer.component';

describe('Testing the SearchResultContainer component', () => {

  it('should show a moreMaterialsButton when there are more than 19 material results to show', () => {
    const store = {};
    const search = {
      materialSearchResults: harrySearchResults,
      materialSearchOffset: 0,
      materialSearchLimit: 5,
      groupSearchResults: [],
      groupSearchOffset: 0,
      groupSearchLimit: 5,
      filters: {
        groupFilter: false
      }
    };

    const searchActions = {};
    assert.isAbove(harrySearchResults.length, 19); // assuming that our mock harry potter data has more than 19 results
    const tree = sd.shallowRender(
      <SearchResultContainer
        store={store}
        search={search}
        searchActions={searchActions}
      />
    );

    const VisFlereFunc = () => tree.dive(['#moreMaterialsButton']);
    assert.doesNotThrow(VisFlereFunc, '#moreMaterialsButton not found in tree');
  });

  // github #37, #40
  it('does not show the moreMaterialsButton when there less than 20 material results to show', () => {
    assert.isBelow(lessThan20SearchResults.length, 20, 'mock data should be below 20 in length');
    const store = {};
    const search = {
      materialSearchResults: lessThan20SearchResults,
      materialSearchOffset: 0,
      materialSearchLimit: 5,
      groupSearchResults: [],
      groupSearchOffset: 0,
      groupSearchLimit: 5,
      filters: {
        groupFilter: false
      }
    };

    const searchActions = {};
    const tree = sd.shallowRender(
      <SearchResultContainer
        store={store}
        search={search}
        searchActions={searchActions}/>
    );

    const VisFlereFunc = () => tree.dive(['#moreMaterialsButton']);
    assert.throws(VisFlereFunc, '#moreMaterialsButton not found in tree');
  });

});
