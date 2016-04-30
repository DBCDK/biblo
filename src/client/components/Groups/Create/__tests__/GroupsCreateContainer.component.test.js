/**
 * @file: Tests for group create container.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {GroupCreateContainer} from '../GroupCreateContainer.component';

import groupCreateReducer from '../../../../Reducers/groupCreate.reducer';

describe('Test group create container', () => {
  it('Test group create container can render', () => {
    const noop = () => {};

    // just get initial state
    let group = groupCreateReducer(undefined, {}); // eslint-disable-line no-undefined
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

    // actions for this test (just use spies)
    let actions = {
      changeGroupColour: noop,
      asyncChangeImage: noop
    };

    let uiActions = {
      openModalWindow: noop,
      closeModalWindow: noop
    };

    let component = (
      <GroupCreateContainer
        searchState={searchState}
        searchActions={{}}
        group={group}
        actions={actions}
        uiActions={uiActions}
        />
    );


    let dm = TestUtils.renderIntoDocument(component);
    let dmn = ReactDOM.findDOMNode(dm);
    expect(dmn.innerHTML).toContain('Opret gruppe');
  });
});
