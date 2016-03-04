'use strict';


import parseJsonData from '../Utils/parseJsonData.js';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const defaultState = [
];

const groupData = parseJsonData('JSONDATA', 'groupData');

export default function listGroupsReducer(state = groupData, action = {}) {
  switch (action.type) {
    case types.LIST_GROUPS:
      return state;
    default:
      return state;
  }
}