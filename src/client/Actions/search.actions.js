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
