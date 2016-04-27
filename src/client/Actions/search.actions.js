/**
 * @file: Search actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const openPlatformSuggest = SocketClient('suggest');
const openPlatformSuggestListener = once(openPlatformSuggest.response);

export function toggleSearchBox() {
  return {
    type: types.TOGGLE_SEARCH_BOX
  };
}

export function searchMaterials(query) {
  // OLD SKOOL redirect
  window.location = '/search?q=' + query.query;
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
