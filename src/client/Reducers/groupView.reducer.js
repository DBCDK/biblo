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
  isLoadingMembers: false,
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
        // update members and transition away from loading state
        return assignToEmpty(state, {isMembersExpanded: action.expand, members: action.members, isLoadingMembers: false});
      }
      return assignToEmpty(state, {isMembersExpanded: action.expand});
    case types.GROUP_MEMBERS_LOADING:
       return assignToEmpty(state, {isLoadingMembers: true});
    default:
      return state;
  }
}
