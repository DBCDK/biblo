/**
 * @file
 * Testing the SearchResultContainer
 */

import React from 'react';
import {assert} from 'chai';
import {harrySearchResults} from '../../__mocks__/searchresults.mock.js';
import sd from 'skin-deep';
import {SearchResultContainer} from '../SearchResultContainer.component';

describe('Testing the SearchResultContainer component', () => {
  let lessThan20materialSearchResult = [{
    dcTitle: ['Hjemmesidebogen'],
    pid: ['870970-basis:23628481'],
    workType: ['book'],
    coverUrlFull: ['http://placekitten.com/100/300']
  }, {
    dcTitle: ['Web-design for alle'],
    pid: ['870970-basis:22295284'],
    workType: ['book']
  }
  ];

  it('should show a Visflere Button when there are more than 19 material results to show', () => {
    const store = {};
    const search = {
      materialSearchResults: harrySearchResults
    };
    const searchActions = {};
    assert.isAbove(harrySearchResults.length, 19); // assuming that our mock harry potter data has more than 20 results
    const tree = sd.shallowRender(
      <SearchResultContainer
        store={store}
        search={search}
        searchActions={searchActions} />
    );

    const VisFlereFunc = () => tree.dive(['VisFlereButton']);
    assert.doesNotThrow(VisFlereFunc, 'VisFlereButton not found in tree');
  });

  // github #37
  it('should not show a Visflere Button when there less than 20 material results to show', () => {
    assert.isBelow(lessThan20materialSearchResult.length, 20, 'mock data should be below 20 in length');
    const store = {};
    const search = {
      materialSearchResults: lessThan20materialSearchResult
    };
    const searchActions = {};
    const tree = sd.shallowRender(
      <SearchResultContainer
        store={store}
        search={search}
        searchActions={searchActions} />
    );

    const VisFlereFunc = () => tree.dive(['VisFlereButton']);
    assert.throws(VisFlereFunc, 'VisFlereButton not found in tree');
  });

});
