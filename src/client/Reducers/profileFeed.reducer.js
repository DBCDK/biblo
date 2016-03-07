'use strict';

/**
 * @file: Profile feed reducer
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {
  feed: [],
  count: {
    comments: 0,
    commentsTotal: 0,
    posts: 0,
    postsTotal: 0
  },
  profile: {
    displayName: 'Anonym',
    image: '/no_profile.png',
    id: 0,
    description: ''
  }
};

let json_feed_data = parseJsonData('JSONDATA', 'feed');
initialState.feed = json_feed_data.feed || [];
initialState.count = assignToEmpty(initialState.count, json_feed_data.count || {});
initialState.profile = assignToEmpty(initialState.profile, json_feed_data.profile || {});

export default function profileFeedReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GET_USER_FEED:
      return assignToEmpty(state, {
        feed: state.feed.concat(action.feed || []),
        count: assignToEmpty(state.count, action.count),
        profile: assignToEmpty(state.profile, action.profile)
      });

    default:
      return state;
  }
}
