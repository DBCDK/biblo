'use strict';

import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';
import assignToEmpty from '../Utils/assign';


export default function listGroupsReducer(state, action = {}) {
  Object.freeze(state);
  console.log("state:", state);
  console.log("action:", action);
  switch (action.type) {
    case types.LIST_GROUPS:
      console.log("LIST_GROUPS");
      var out = assignToEmpty(state, {
        loadingGroups: false,
        groups: action.groupData,
        groupsLimit: action.groupsLimit
      });
      return out;
    case types.LIST_GROUPS_IS_LOADING:
      console.log("LIST_GROUPS_IS_LOADING");
      var out = assignToEmpty(state, {
        loadingGroups: true,
        groups: state.groups,
        groupsLimit: action.groupsLimit
      });
      return out;
    default:
      var jsonData = parseJsonData('JSONDATA', 'jsonData');
      var out = assignToEmpty(state, {
        loadingGroups: false,
        groups: jsonData.groups,
        groupsLimit: 15
      });
      return out;
  }
}
