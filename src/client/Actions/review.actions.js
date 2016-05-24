/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const getReviewsClient = SocketClient('getReviews');
const deleteReviewClient = SocketClient('deleteReview');

export function showWorkReviews(response, pids, skip, limit, ownId) {
  return {
    type: types.GET_WORK_REVIEWS,
    reviews: response,
    pids: pids,
    skip: skip,
    limit: limit,
    workReviewsTotalCount: response.reviewsCount,
    ownId: ownId
  };
}

export function moreWorkReviewsLoading() {
  return {
    type: types.GET_WORK_REVIEWS_IS_LOADING
  };
}

export function asyncShowReview(id) {
  return function (dispatch) {
    dispatch(moreWorkReviewsLoading());
    getReviewsClient.request({id});
    const event = getReviewsClient.response(response => {
      dispatch(showWorkReviews(response, null, 0, 1, id));
      event.off();
    });
  };
}

export function asyncShowWorkReviews(pids, skip, limit, ownId) {
  return function (dispatch) {
    dispatch(moreWorkReviewsLoading());
    getReviewsClient.request({pids, skip, limit});
    const event = getReviewsClient.response(response => {
      dispatch(showWorkReviews(response, pids, skip, limit, ownId));
      event.off();
    });
  };
}

export function createWorkReview(review) {
  return {
    type: types.CREATE_WORK_REVIEW,
    review: review
  };
}

export function asyncDeleteWorkReview(reviewId, pids) {
  let skip=0, limit = 10;
  return function (dispatch) {
    dispatch(deleteReview(reviewId));
    deleteReviewClient.request({id: reviewId});
    const event = deleteReviewClient.response(() => {
      if (pids) {
        dispatch(asyncShowWorkReviews(pids, skip, limit, null));
      }
      else {
        dispatch(deleteReview(reviewId));
      }
      event.off();
    });
  };
}

export function deleteReview(reviewId) {
  return {
    type: types.DELETE_WORK_REVIEW,
    reviewId: reviewId
  };
}
