/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const searchReviewsClient = SocketClient('searchReviews');
const getReviewsClient = SocketClient('getReviews');
const getGenresClient = SocketClient('getGenres');
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

export function showReviewList(params) {
  const WORK_TYPES_MAPPINGS = {
    'alle typer': '',
    bøger: ' AND worktype:book',
    film: ' AND worktype:movie',
    spil: ' AND worktype:game',
    musik: ' AND worktype:music',
    tegneserier: ' AND worktype:book'
  };
  const REVIEW_TYPES_MAPPINGS = {
    'alle typer': '',
    tekst: ' AND !image:* AND !video:*',
    billede: ' AND image:*',
    video: ' AND video:*'
  };
  const ORDER_MAPPINGS = {
    nyeste: 'created:desc',
    'mest likede': 'numLikes:desc',
    tilfældig: ''
  };

  const existFilter = '!markedAsDeleted:true';
  const genre = params.genre === 'alle' ? '' : ` AND genres.title:"${params.genre}"`;
  const query = `${existFilter}${genre}${WORK_TYPES_MAPPINGS[params.workType]}${REVIEW_TYPES_MAPPINGS[params.reviewType]}`;
  const sort = ORDER_MAPPINGS[params.order];

  return function (dispatch) {
    searchReviewsClient.request({
      elasticQuery: {query, sort}
    });
    const event = searchReviewsClient.response(response => {
      dispatch({
        type: types.GET_REVIEWS,
        reviews: response.data
      });
      event.off();
    });
  };
}

export function showGenres() {
  return function (dispatch) {
    getGenresClient.request({});
    const event = getGenresClient.response(response => {
      dispatch({
        type: types.GET_GENRES,
        genres: response.data
      });
      event.off();
    });
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
