'use strict';

import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';

export default function listGroupsReducer(state, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.LIST_GROUPS:
      return action.groupData;
    default:
      const groupData = parseJsonData('JSONDATA', 'groupData');
      return groupData;
  }
}
