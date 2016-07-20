/**
 * @file: Search actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once, filter} from 'lodash';

const searchClient = SocketClient('search');
const searchClientListener = once(searchClient.response);

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
    searchClientListener((res) => dispatch(loadedMoreMaterialResults(res)));

    const materialTypes = filter(Object.keys(query.materialFilters), (type) => {
      return query.materialFilters[type].enabled;
    });

    searchClient.request({
      q: query.query,
      materialer: materialTypes.join(),
      emneord: query.subjects.join(),
      limit: 20,
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
      limit: 20,
      from: query.from
    });
  };
}

export function toggleSearchBox() {
  return {
    type: types.TOGGLE_SEARCH_BOX
  };
}

export function toggleGroupFilter() {
  return {
    type: types.SEARCH_TOGGLE_GROUP_FILTER
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

export function search(query) {

  // create array of enabled material filter types
  const materialTypes = filter(Object.keys(query.materialFilters), (type) => {
    return query.materialFilters[type].enabled;
  });

  let searchUrl =
    '/find?q=' + encodeURIComponent(query.query) +
     '&grupper=' + (query.groupFilter ? 1 : 0) +
    '&emneord=' + encodeURIComponent(query.subjects.join()) +
    '&materialer=' + encodeURIComponent(materialTypes.join());

  // OLD SKOOL redirect
  window.location = searchUrl;
  return {
    type: types.SEARCH
  };
}

export function suggestionsAreLoading(q) {
  return {
    type: types.SUGGESTIONS_ARE_LOADING,
    q
  };
}

export function getWorkSuggestions(q) {
  return (dispatch) => {
    // set loading
    dispatch(suggestionsAreLoading(q));

    // Call the service provider via middleware
    dispatch({
      type: types.callServiceProvider,
      event: 'suggest',
      data: {q}
    });
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
