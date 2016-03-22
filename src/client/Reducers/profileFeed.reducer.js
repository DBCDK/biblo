'use strict';

/**
 * @file: Profile feed reducer
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';
import {filter} from 'lodash';

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
      let existingKeys = state.feed.map((activity) => {
        return `${activity.type}_${activity.id}`;
      });

      action.feed = action.feed.filter((activity) => {
        return existingKeys.indexOf(`${activity.type}_${activity.id}`) < 0;
      });

      return assignToEmpty(state, {
        feed: state.feed.concat(action.feed || []),
        count: assignToEmpty(state.count, action.count),
        profile: assignToEmpty(state.profile, action.profile)
      });

    case types.LIKE_POST:
      const likedFeedCopy = [...state.feed];

      likedFeedCopy.forEach((activity) => {
        if (activity.type === 'comment' && activity.commentcontainerpostid === action.postId) {
          activity.post.likes.push(action.profileId);
        }
        else if (activity.type === 'post' && activity.id === action.postId) {
          activity.likes.push(action.profileId);
        }
      });

      return assignToEmpty(state, {
        feed: likedFeedCopy
      });

    case types.UNLIKE_POST:
      const unlikedFeedCopy = [...state.feed];

      unlikedFeedCopy.forEach((activity) => {
        if (activity.type === 'comment' && activity.commentcontainerpostid === action.postId) {
          activity.post.likes = filter(activity.post.likes, (id) => {
            return id !== action.profileId;
          });
        }
        else if (activity.type === 'post' && activity.id === action.postId) {
          activity.likes = filter(activity.likes, (id) => {
            return id !== action.profileId;
          });
        }
      });

      return assignToEmpty(state, {
        feed: unlikedFeedCopy
      });

    default:
      return state;
  }
}
