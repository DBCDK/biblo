'use strict';

/**
 * @file: Profile feed reducer
 */

import parseJsonData from '../Utils/parseJsonData';

let initialState = parseJsonData('JSONDATA', 'feed');

export default function profileFeedReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    default:
      return state;
  }
}
