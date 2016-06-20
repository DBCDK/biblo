/**
 * @file: Search actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once, filter} from 'lodash';

const openPlatformSuggest = SocketClient('suggest');
const openPlatformSuggestListener = once(openPlatformSuggest.response);
const search = SocketClient('search');
const searchListener = once(search.response);

const searchGroups = SocketClient('searchGroups');
const searchGroupListener = once(searchGroups.response);

export function loadedMoreMaterialResults(res) {
  return {
    type: types.LOADED_MORE_MATERIAL_RESULTS,
    results: res.data
  };
}

export function loadMoreMaterialResults() {
  return {
    type: types.LOAD_MORE_MATERIAL_RESULTS
  };
}

export function asyncLoadMoreMaterialResults(query) {
  return (dispatch) => {
    dispatch(loadMoreMaterialResults());
    searchListener((res) => dispatch(loadedMoreMaterialResults(res)));

    const materialTypes = filter(Object.keys(query.materialFilters), (type) => {
      return query.materialFilters[type].enabled;
    });

    search.request({
      q: query.query,
      materialer: materialTypes.join(),
      emneord: query.subjects.join(),
      offset: query.offset
    });
  };
}

export function loadedMoreGroupResults (res) {
  return {
    type: types.LOADED_MORE_GROUP_RESULTS,
    results: res

  };
}

export function loadMoreGroupResults() {
  return {
    type: types.LOAD_MORE_GROUP_RESULTS
  };
}

export function asyncLoadMoreGroupResults(query) {
  return (dispatch) => {
    dispatch(loadMoreGroupResults());
    searchGroupListener((res) => dispatch(loadedMoreGroupResults(res)));
    searchGroups.request({
      q: query.query,
      limit: query.limit,
      from: query.from
    });
  };
}

export function toggleSearchBox() {
  return {
    type: types.TOGGLE_SEARCH_BOX
  };
}

export function toggleMaterialFilter(materialType) {
  return {
    type: types.SEARCH_TOGGLE_MATERIAL_FILTER,
    materialType: materialType
  };
}

export function resetMaterialFilters() {
  return {
    type: types.SEARCH_RESET_MATERIAL_FILTERS
  };
}

export function searchMaterials(query) {
  // create array of enabled material filter types
  const materialTypes = filter(Object.keys(query.materialFilters), (type) => {
    return query.materialFilters[type].enabled;
  });

  let searchUrl =
    '/find?q=' + encodeURIComponent(query.query) +
    '&emneord=' + encodeURIComponent(query.subjects.join()) +
    '&materialer=' + encodeURIComponent(materialTypes.join());

  // OLD SKOOL redirect
  window.location = searchUrl;
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
