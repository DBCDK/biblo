/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const createReviewClient = SocketClient('createReview');
const updateReviewClient = SocketClient('updateReview');

export function asyncCreateReview(review) {
  return (dispatch) => {
    createReviewClient.request(review);
    const event = createReviewClient.response(function () {
      dispatch(createReview(review));
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

export function asyncUpdateReview(review) {
  return (dispatch) => {
    updateReviewClient.request(review);
    const event = updateReviewClient.response(function () {
      dispatch(updateReview(review));
      event.off();
    });
  };
}

export function updateReview(review) {
  return {
    type: types.UPDATE_REVIEW,
    review: review
  };
}
