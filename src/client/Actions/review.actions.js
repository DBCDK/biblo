/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const createReviewClient = SocketClient('createReview');

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
