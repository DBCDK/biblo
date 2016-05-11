/**
 * @file: Profile reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';
import {includes, filter} from 'lodash';

let jsonData = document.getElementById('JSONDATA');
let initialState = {};
if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
  let data = JSON.parse(jsonData.innerHTML);
  initialState = data;
}

export default function reviewReducer(state = initialState, action = {}) {
  Object.freeze(state);

  switch (action.type) {
    case types.GET_REVIEWS: {
      return assignToEmpty(state, {
        reviewVisible: false,
        reviewsLoading: false,
        reviews: action.reviews.data,
        reviewsLimit: action.limit,
        reviewsCount: state.reviewsCount
      });
    }

    case types.GET_REVIEWS_IS_LOADING: {
      return assignToEmpty(state, {
        reviewVisible: false,
        reviewsLoading: true,
        reviews: state.reviews.data,
        reviewsLimit: state.limit
      });
    }

    case types.CREATE_REVIEW: {
      return assignToEmpty(state, {
        reviewVisible: false,
        reviews: [action.review, ...state.reviews]});
    }

    case types.DELETE_REVIEW: {
      let reviewsAfterDelete = [...state.reviews];
      reviewsAfterDelete = filter(reviewsAfterDelete, (review) => {
        return (review.reviewId !== action.id);
      });
      return assignToEmpty(state, {reviews: reviewsAfterDelete});
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

    default: {
      return assignToEmpty(state, {
        reviewsLoading: false,
        reviewsLimit: 10
      });
    }
  }
}
