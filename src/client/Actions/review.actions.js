/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const createReviewClient = SocketClient('createReview');
const getReviewsClient = SocketClient('getReviews');
const deleteReviewClient = SocketClient('deleteReview');

export function asyncCreateReview(review) {
  return (dispatch) => {
    createReviewClient.request(review);
    const event = createReviewClient.response(function () {
      dispatch(createReview(review));
      event.off();
    });
  };
}

export function showReviews(response, pids, skip, limit) {
  return {
    type: types.GET_REVIEWS,
    reviews: response,
    pids: pids,
    skip: skip,
    limit: limit
  };
}

export function moreReviewsLoading() {
  return {
    type: types.GET_REVIEWS_IS_LOADING
  };
}

export function asyncShowReviews(pids, skip, limit) {
  return function (dispatch) {
    dispatch(moreReviewsLoading());
    getReviewsClient.request({pids, skip, limit});
    const event = getReviewsClient.response(response => {
      dispatch(showReviews(response, pids, skip, limit));
      event.off();
    });
  };
}

export function createReview(review) {
  return {
    type: types.CREATE_REVIEW,
    review: review
  };
}

export function asyncDeleteReview(reviewId) {
  return function (dispatch) {
    dispatch(deleteReview(reviewId));
    deleteReviewClient.request({id: reviewId});
  };
}

export function deleteReview(reviewId) {
  return {
    type: types.DELETE_REVIEW,
    postId: reviewId
  };
}
