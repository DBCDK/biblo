/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const createReviewClient = SocketClient('createReview');
const getReviewsClient = SocketClient('getReviews');

export function asyncCreateReview(review) {
  return (dispatch) => {
    createReviewClient.request(review);
    const event = createReviewClient.response(function () {
      dispatch(createReview(review));
      event.off();
    });
  };
}

export function showReviews(response, skip, limit) {
  return {
    type: types.GET_REVIEWS,
    reviews: response,
    skip: skip,
    limit: limit
  };
}

export function moreReviewsLoading() {
  return {
    type: types.GET_REVIEWS_IS_LOADING
  };
}

export function asyncShowReviews(skip, limit) {
  return function (dispatch) {
    dispatch(moreReviewsLoading());
    getReviewsClient.request({skip, limit});
    const event = getReviewsClient.response(response => {
      dispatch(showReviews(response, skip, limit));
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
