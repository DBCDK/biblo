/**
 * @file: feed actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const likePostSocketClient = SocketClient('likePost');
const unlikePostSocketClient = SocketClient('unlikePost');

const likeReviewSocketClient = SocketClient('likeReview');
const unlikeReviewSocketClient = SocketClient('unlikeReview');

export function likePost(like) {
  likePostSocketClient.request({
    profileId: like.profileId,
    postId: like.postId
  });
  return {
    type: types.LIKE_POST,
    profileId: like.profileId,
    postId: like.postId
  };
}

export function unlikePost(like) {
  unlikePostSocketClient.request({
    profileId: like.profileId,
    postId: like.postId
  });
  return {
    type: types.UNLIKE_POST,
    profileId: like.profileId,
    postId: like.postId
  };
}

export function likeReview(like) {
  likeReviewSocketClient.request({
    profileId: like.profileId,
    reviewId: like.reviewId
  });
  return {
    type: types.LIKE_WORK_REVIEW,
    profileId: like.profileId,
    reviewId: like.reviewId
  };
}

export function unlikeReview(like) {
  unlikeReviewSocketClient.request({
    profileId: like.profileId,
    reviewId: like.reviewId
  });
  return {
    type: types.UNLIKE_WORK_REVIEW,
    profileId: like.profileId,
    reviewId: like.reviewId
  };
}

