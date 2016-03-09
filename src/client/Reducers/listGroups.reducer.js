'use strict';

import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';
import assignToEmpty from '../Utils/assign';


export default function listGroupsReducer(state, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.LIST_GROUPS:
      return action.groupData;
    case types.LIST_GROUPS_IS_LOADING:
    case types.GROUP_LOADING_MORE_POSTS:
      return assignToEmpty(state, {loadingGroups: true});
    default:
      const groupData = parseJsonData('JSONDATA', 'groupData');
      return groupData;
  }
}
