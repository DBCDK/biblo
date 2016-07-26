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
        profileState={{}}
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
        searchActions={searchActions}
        profileState={{}}
      />
    );

    const VisFlereFunc = () => tree.dive(['#moreMaterialsButton']);
    assert.throws(VisFlereFunc, '#moreMaterialsButton not found in tree');
  });


  it('shows all lists when not filtering', () => {
    const store = {};
    const search = {
      materialSearchResults: [],
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
        searchActions={searchActions}
        profileState={{}}
      />
    );

    assert.isTrue(tree.subTree('MaterialSearchResultList').getRenderOutput().props.results.length === search.materialSearchResults.length,
           'MaterialSearchResultList was not shown with no filters on');
    assert.isTrue(tree.subTree('GroupSearchResultList').getRenderOutput().props.results.length === search.groupSearchResults.length,
            'GroupSearchResultList was not shown with no filters on ');
  });

  // "Når Anton trykker på "Grupper"-knappen vises kun resultater fra Grupperne (med mindre han har aktiveret andre filterknapper)."
  // "Ved tryk på "Gruppe"-filterknappen forsvinder "På biblioteket"-overskriften sammen med resultaterne for materialesøgningen."
  it('does not show the material list when group filter is on and no material filters are enabled', () => {
    const store = {};
    const search = {
      materialSearchResults: lessThan20SearchResults,
      materialSearchOffset: 0,
      materialSearchLimit: 5,
      groupSearchResults: [],
      groupSearchOffset: 0,
      groupSearchLimit: 5,
      filters: {
        groupFilter: true
      }
    };

    const searchActions = {};
    const tree = sd.shallowRender(
      <SearchResultContainer
        store={store}
        search={search}
        searchActions={searchActions}
        profileState={{}}
      />
    );

    assert.isFalse(tree.subTree('MaterialSearchResultlist'),
        'material list was shown when material filters are enabled and groupfilter is on');
  });

  // "På samme måde skal "I grupperne"-overskriften og resultater fra grupperne forsvinde, når en af de andre filter-knapper aktiveres."
  it('does not show the group list when a material filter is on and when the group filter is not on', () => {
    const store = {};
    const search = {
      materialSearchResults: lessThan20SearchResults,
      materialSearchOffset: 0,
      materialSearchLimit: 5,
      groupSearchResults: [],
      groupSearchOffset: 0,
      groupSearchLimit: 5,
      filters: {
        groupFilter: false,
        materialFilters: {
          book: {enabled: true},
          game: {enabled: false},
          movie: {enabled: false},
          music: {enabled: false},
          audiobook: {enabled: false}
        }
      }
    };

    const searchActions = {};
    const tree = sd.shallowRender(
      <SearchResultContainer
        store={store}
        search={search}
        searchActions={searchActions}
        profileState={{}}
      />
    );

    assert.isFalse(tree.subTree('GroupSearchResultlist'),
      'group list was shown when a material filter is enabled and groupfilter is off');

  });

});
