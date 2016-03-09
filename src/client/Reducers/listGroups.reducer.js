'use strict';

import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';
import assignToEmpty from '../Utils/assign';


export default function listGroupsReducer(state, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.LIST_GROUPS:
      var out = assignToEmpty(state, {
        loadingGroups: false,
        groups: action.groups,
        groupsLimit: action.limit
      });

      return out;
    case types.LIST_GROUPS_IS_LOADING:
      //we do not expect the groups list to be altered here yet (we are still loading)
      var out = assignToEmpty(state, {
        loadingGroups: true,
        groups: state.groups,
        groupsLimit: state.groupsLimit
      });

      return out;
    default:
      var jsonData = parseJsonData('JSONDATA', 'groupData');
      var out = assignToEmpty(state, {
        loadingGroups: false,
        groups: jsonData,
        groupsLimit: 15
      });

      return out;
  }
}
