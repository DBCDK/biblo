/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const getReviewsClient = SocketClient('getReviews');
const deleteReviewClient = SocketClient('deleteReview');

const getWorksSocket = SocketClient('work');

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

export function showReviewList(skip, limit) {
  return function (dispatch) {

    // Fetch reviews
    getReviewsClient.request({skip, limit});
    const event = getReviewsClient.response(response => {
      const reviews = response.data;
      const pids = _.uniq(reviews.map(r => r.pid));

      pids.push('870970-basis:22995154'); // pid with campaign

      // Fetch reviewed works
      getWorksSocket.request({pids: pids, fields: ['coverUrlThumbnail', 'dcTitle', 'dcTitleFull', 'pid', 'workType']})
      getWorksSocket.response(workResponse => {

        // map pids to works
        const pidToWork = {}
        workResponse.data.forEach(work =>{ pidToWork[work.pid] = work });

        // merge reviews and works
        const merged = []
        reviews.forEach(review => {
          const work = pidToWork[review.pid];
          console.log('work', work)
          console.log('review', review);
          if (work) {
            merged.push({review, work});
          }
        });

        dispatch({
          type: types.GET_REVIEWS,
          reviews: merged
        });

        event.off();
      });
    });

  }
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

export function asyncDeleteWorkReview(reviewId, pids, pid) {
  let skip=0, limit = 10;
  return function (dispatch) {
    dispatch(deleteReview(reviewId));
    deleteReviewClient.request({id: reviewId, pid: pid});
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
