'use strict';

/**
 * @file: GroupView reducer
 */

import parseJsonData from '../Utils/parseJsonData.js';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const defaultState = {
  name: '',
  description: '',
  id: null,
  isFollowing: false,
  image: 'http://lorempixel.com/200/200/',
  isMembersExpanded: false,
  posts: []
};

const groupData = parseJsonData('JSONDATA', 'groupData');
const initialState = Object.assign({}, defaultState, groupData);

export default function groupViewReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GET_GROUP:
      return state;
    case types.GROUP_FOLLOW:
      return assignToEmpty(state, {isFollowing: action.enableFollow});
    case types.GROUP_MEMBERS_EXPAND:
      if (action.members !== null) {
        return assignToEmpty(state, {isMembersExpanded: action.expand, members: action.members});
      }
      return assignToEmpty(state, {isMembersExpanded: action.expand});
    default:
      return state;
  }
}
