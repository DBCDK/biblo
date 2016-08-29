/**
 * @file: Tests for groups container.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {GroupsContainer} from '../GroupsContainer.component';

describe('GroupsContainer component tests', () => {
  it('should render Opret button and Nyeste grupper', () => {

    const searchState = {
      isSearchBoxVisible: false,
      groupSearchResults: [],
      groupSearchResultsPending: true,
      materialSearchResults: [],
      materialSearchResultsPending: true,
      workSuggestions: {},
      workSuggestionsPending: false,
      selectedWorkSuggestion: -1,
      initialQuery: '',
      query: '',
      isLoadingResults: false
    };
    const searchActions = {};

    const data = {
      newLoading: false,
      popularLoading: false,
      popularGroups: [],
      newGroups: [],
      newLimit: 15,
      popularLimit: 15
    };

    const actions = {
      asyncShowGroups: () => {
      }
    };

    const comp = TestUtils.renderIntoDocument(
      <GroupsContainer
        searchState={searchState}
        globalState={{}}
        searchActions={searchActions}
        data={data}
        actions={actions}
        profileState={{}}
      />
    );
    expect(ReactDOM.findDOMNode(comp).children[1].children[1].textContent)
      .toEqual('Opret ny gruppePopulære grupperNyeste grupper');

  });
});
