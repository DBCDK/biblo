/**
 * @file: Search reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {
  isSearchBoxVisible: false,
  groupSearchResults: [],
  groupSearchResultsPending: true,
  materialSearchResults: [],
  materialSearchResultsPending: true,
  initialQuery: '',
  isLoadingResults: false
};

let jsonData = document.getElementById('JSONDATA');

if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
  let data = JSON.parse(jsonData.innerHTML);
  if (data.query) {
    // set initial query that was delivered with the HTTP response
    initialState.initialQuery = data.query;
    initialState.isSearchBoxVisible = true;
  }

  if (data.materialSearchResults) {
    initialState.materialSearchResults = data.materialSearchResults;
    initialState.materialSearchResultsPending = false;
  }
}


export default function searchReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.TOGGLE_SEARCH_BOX:
      return assignToEmpty(state, {isSearchBoxVisible: !state.isSearchBoxVisible});
    case types.LOAD_MORE_RESULTS:
      return assignToEmpty(state, {isLoadingResults: true});
    case types.LOADED_MORE_RESULTS:
      return assignToEmpty(state, {materialSearchResults: action.results, isLoadingResults: false});
    default:
      return state;
  }
}
