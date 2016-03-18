'use strict';

/**
 * @file: GroupView reducer
 */

import parseJsonData from '../Utils/parseJsonData.js';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';
import {includes, filter} from 'lodash';

const defaultState = {
  name: '',
  description: '',
  id: null,
  isFollowing: false,
  isLoadingMembers: false,
  image: '/no_group_image.png',
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
    case types.GROUP_SHOW_MORE_POSTS:
      const posts = [...state.posts, ...action.posts];
      return assignToEmpty(state, {posts, numberOfPostsLoaded: action.numberOfPostsLoaded, loadingPosts: false});
    case types.GROUP_LOADING_MORE_POSTS:
      return assignToEmpty(state, {loadingPosts: true});
    case types.GROUP_SHOW_MORE_COMMENTS:
      const postsAltered = [...state.posts];
      postsAltered.forEach(post => {
        if (post.id === action.id) {
          post.comments = [...post.comments, ...action.comments];
          post.numberOfCommentsLoaded = action.numberOfCommentsLoaded;
          post.loadingComments = false;
        }
      });
      return assignToEmpty(state, {posts: postsAltered});
    case types.GROUP_LOADING_MORE_COMMENTS:
      const postsloadingComments = [...state.posts];
      postsloadingComments.forEach(post => {
        if (post.id === action.postId) {
          post.loadingComments = true;
        }
      });
      return assignToEmpty(state, {posts: postsloadingComments});
    case types.LIKE_POST:
      const postsCopyLiked = [...state.posts];

      postsCopyLiked.forEach(post => {
        if (post.id === action.postId) {
          const isAlreadyLikedByUser = includes(post.likes, action.profileId);
          if (!isAlreadyLikedByUser) {
            post.likes.push(action.profileId);
          }
        }
      });

      return assignToEmpty(state, {posts: postsCopyLiked});
    case types.UNLIKE_POST:
      const postsCopyUnliked = [...state.posts];

      postsCopyUnliked.forEach(post => {
        if (post.id === action.postId) {
          const isAlreadyLikedByUser = includes(post.likes, action.profileId);
          if (isAlreadyLikedByUser) {
            post.likes = filter(post.likes, (id) => {
              return (id !== action.profileId);
            });
          }
        }
      });

      return assignToEmpty(state, {posts: postsCopyUnliked});
    default:
      return state;
  }
}
