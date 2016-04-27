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
  workSuggestions: {},
  workSuggestionsPending: false,
  initialQuery: ''
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

    case types.SUGGESTIONS_ARE_LOADING:
      return assignToEmpty(state, {workSuggestionsPending: true});

    case types.GOT_OPENPLATFORM_SUGGESTIONS:
      let newState = assignToEmpty(state, {});
      newState.workSuggestions[action.res.q] = action.res.data;
      return newState;

    default:
      return state;
  }
}
