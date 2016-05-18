/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const getReviewsClient = SocketClient('getReviews');
const deleteReviewClient = SocketClient('deleteReview');
import {addContent} from '../Utils/uploadmedia.js';

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

/**
 * Create a WorkReview . dispatches to show to support upsert approach (insert + update)
 * @param form
 * @param pids
 * @param callback
 * @returns {Function}
 */
export function asyncCreateWorkReview(form, pids, callback) {
  return function (dispatch) {
    let skip=0, limit = 10;
    addContent(form, '/anmeldelse/').then((response) => {
      if (callback) {
        callback();
      }
      if (pids) {
        asyncShowWorkReviews(pids, skip, limit, response.data.id)(dispatch);
      }
      else {
        dispatch(createWorkReview(response));
      }
    }).catch((response) => {
      dispatch(createWorkReview(response));
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
