/**
 * @file: Profile reducer
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';
import {includes, filter} from 'lodash';

const json_feed_data = parseJsonData('JSONDATA', 'feed');
const json_review_data = parseJsonData('JSONDATA', 'reviews');

let initialState = {};
initialState.profile = assignToEmpty(initialState.profile, json_feed_data.profile || {}); // might be unnessecary...?
initialState.reviews = json_review_data || [];

export default function reviewReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GET_REVIEWS: {
      return assignToEmpty(state, {
        reviewsLoading: false,
        reviews: action.reviews.data,
        reviewsLimit: action.limit,
        reviewsCount: state.reviewsCount
      });
    }

    case types.GET_REVIEWS_IS_LOADING: {
      return assignToEmpty(state, {
        reviewsLoading: true,
        reviews: state.reviews.data,
        reviewsLimit: state.limit
      });
    }

    case types.CREATE_REVIEW: {
      return assignToEmpty(state,
        {
          review: action.review
        });
    }

    case types.LIKE_REVIEW: {
      const reviewsCopyLiked = [...state.reviews];
      reviewsCopyLiked.forEach(review => {
        if (review.id === action.reviewId) {
          const isAlreadyLikedByUser = includes(review.likes, action.profileId);
          if (!isAlreadyLikedByUser) {
            review.likes.push(action.profileId);
          }
        }
      });
      return assignToEmpty(state, {posts: reviewsCopyLiked});
    }

    case types.UNLIKE_REVIEW: {
      const reviewsCopyUnliked = [...state.reviews];
      reviewsCopyUnliked.forEach(review => {
        if (review.id === action.reviewId) {
          const isAlreadyLikedByUser = includes(review.likes, action.profileId);
          if (isAlreadyLikedByUser) {
            review.likes = filter(review.likes, (id) => {
              return (id !== action.profileId);
            });
          }
        }
      });
      return assignToEmpty(state, {posts: reviewsCopyUnliked});
    }

    case types.DELETE_REVIEW: {
      let reviewsAfterDelete = [...state.reviews];
      reviewsAfterDelete = filter(reviewsAfterDelete, (review)=> {
        return action.reviewId !== review.id;
      });
      return assignToEmpty(state, {reviews: reviewsAfterDelete});
    }

    default: {
      return assignToEmpty(state, {
        reviewsLoading: false,
        reviewsLimit: 10
      });
    }
  }
}
