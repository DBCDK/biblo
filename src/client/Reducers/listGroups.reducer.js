'use strict';

import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';

const groupData = parseJsonData('JSONDATA', 'groupData');

export default function listGroupsReducer(state = groupData, action = {}) {
  switch (action.type) {
    case types.LIST_GROUPS:
      return state;
    default:
      return state;
  }
}
