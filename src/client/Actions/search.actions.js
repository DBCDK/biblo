/**
 * @file: Search actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';


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
