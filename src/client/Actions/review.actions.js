/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const getReviewsClient = SocketClient('getReviews');
const deleteReviewClient = SocketClient('deleteReview');
import {addContent} from '../Utils/uploadmedia.js';

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

export function asyncCreateReview(form, pids) {
  let skip=0, limit = 10;
  return function (dispatch) {
    addContent(form, '/anmeldelse/').then((response) => {
      if (pids) {
        dispatch(asyncShowReviews(pids, skip, limit));
      }
      else {
        dispatch(createReview(response));
      }
    }).catch((response) => {
      dispatch(createReview(response));
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

export function asyncDeleteReview(reviewId, pids) {
  let skip=0, limit = 10;
  return function (dispatch) {
    dispatch(deleteReview(reviewId));
    deleteReviewClient.request({id: reviewId});
    const event = deleteReviewClient.response(() => {
      if (pids) {
        dispatch(asyncShowReviews(pids, skip, limit));
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
    type: types.DELETE_REVIEW,
    reviewId: reviewId
  };
}
