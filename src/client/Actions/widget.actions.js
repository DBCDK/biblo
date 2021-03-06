/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const getReviewsSocket = SocketClient('getReviews');
const getCoverImageSocket = SocketClient('coverImage');

export function asyncGetLatestReviews(sort = 'id DESC', limit, campaignId = false, offset = 0) {
  if (campaignId) {
    return {
      type: types.callServiceProvider,
      event: 'getCampaignReviews',
      data: {order: sort, campaignId, limit, skip: offset}
    };
  }

  return dispatch => {
    getReviewsSocket.responseOnce(res => dispatch(getLatestReviews(sort, limit, res.data, res.reviewsCount)));
    getReviewsSocket.request({order: sort, limit, campaignId, skip: offset});
  };
}

export function getLatestReviews(sort, limit, reviews, reviewsCount) {
  return {
    type: types.GET_LATEST_REVIEWS_FOR_WIDGET,
    sort,
    reviews,
    reviewsCount
  };
}

export function asyncGetCoverImage(pid) {
  // eslint-disable-next-line no-unused-vars
  return dispatch => {
    getCoverImageSocket.request({pid});
  };
}

export function asyncListenForCoverImages() {
  return dispatch => {
    getCoverImageSocket.response(res => dispatch(gotCoverImage(res)));
  };
}

export function gotCoverImage(coverImageResult) {
  return {
    type: types.GOT_COVER_IMAGE_FROM_PID_FOR_WIDGET,
    coverImageResult
  };
}

export function callServiceProvider(event, data) {
  return {
    type: types.callServiceProvider,
    event,
    data
  };
}
