/**
 * @file: Search actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const openPlatformSuggest = SocketClient('suggest');
const openPlatformSuggestListener = once(openPlatformSuggest.response);
const search = SocketClient('search');
const searchListener = once(search.response);

export function loadedMoreResults(res) {
  return {
    type: types.LOADED_MORE_RESULTS,
    results: res.data
  };
}

export function loadMoreResults() {
  return {
    type: types.LOAD_MORE_RESULTS
  };
}

export function asyncLoadMoreResults(query, limit) {
  return (dispatch) => {
    dispatch(loadMoreResults());
    searchListener((res) => dispatch(loadedMoreResults(res)));
    search.request({q: query, limit: limit});
  };
}

export function toggleSearchBox() {
  return {
    type: types.TOGGLE_SEARCH_BOX
  };
}

export function searchMaterials(query) {
  // OLD SKOOL redirect
  window.location = '/find?q=' + encodeURIComponent(query.query);
  return {
    type: types.MATERIAL_SEARCH
  };
}

export function suggestionsAreLoading(q) {
  return {
    type: types.SUGGESTIONS_ARE_LOADING,
    q
  };
}

export function gotOpenPlatformSuggestions(res) {
  return {
    type: types.GOT_OPENPLATFORM_SUGGESTIONS,
    res
  };
}

export function getWorkSuggestions(q) {
  return (dispatch) => {
    // set loading
    dispatch(suggestionsAreLoading(q));

    // create listener
    openPlatformSuggestListener((res) => dispatch(gotOpenPlatformSuggestions(res)));

    // Dispatch request
    openPlatformSuggest.request({q});
  };
}

export function selectNextSuggestedElement() {
  return {
    type: types.SELECT_NEXT_SUGGESTED_WORK_ELEMENT
  };
}

export function selectPreviousSuggestedElement() {
  return {
    type: types.SELECT_PREVIOUS_SUGGESTED_WORK_ELEMENT
  };
}

export function searchQueryHasChanged(q) {
  return {
    type: types.SEARCH_QUERY_HAS_CHANGED,
    q
  };
}
