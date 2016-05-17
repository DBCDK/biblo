/**
 * @file: Profile reducer
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';
import {includes, filter} from 'lodash';

const initialState = {
  orderPolicy: {},
  orderState: 0,
  responses: 0,
  work: parseJsonData('JSONDATA', 'work'),
  workReviews: parseJsonData('JSONDATA', 'workReviews'),
  workReviewsMeta: parseJsonData('JSONDATA', 'workReviewsMeta')
};

export default function workReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GET_REVIEWS: {
      return assignToEmpty(state, {
        workReviews: action.reviews.data,
        workReviewsMeta: {
          reviewsLimit: action.limit,
          reviewsLoading: false,
          reviewVisible: false,
          reviewsTotalCount: state.reviewsTotalCount
        }
      });
    }

    case types.GET_REVIEWS_IS_LOADING: {
      return assignToEmpty(state, {
        workReviewsMeta: assignToEmpty(state.workReviews.Meta, {
          reviewsLoading: true
        })
      });
    }

    case types.CREATE_REVIEW: {
      return assignToEmpty(state, {
        workReviewsMeta: assignToEmpty(state.workReviewsMeta, {reviewVisible: true}),
        workReviews: [action.review, ...state.workReviews]});
    }

    case types.DELETE_REVIEW: {
      let reviewsAfterDelete = [...state.workReviews];
      reviewsAfterDelete = filter(reviewsAfterDelete, (review) => {
        return (review.reviewId !== action.id);
      });
      return assignToEmpty(state, {
        workReviewsMeta: assignToEmpty(state.workReviewsMeta, {reviewVisible: true}),
        workReviews: reviewsAfterDelete
      });
    }

    case types.LIKE_REVIEW: {
      const reviewsCopyLiked = [...state.workReviews];
      reviewsCopyLiked.forEach(review => {
        if (review.id === action.reviewId) {
          const isAlreadyLikedByUser = includes(review.likes, action.profileId);
          if (!isAlreadyLikedByUser) {
            review.likes.push(action.profileId);
          }
        }
      });
      return assignToEmpty(state, {workReviews: reviewsCopyLiked});
    }

    case types.UNLIKE_REVIEW: {
      const reviewsCopyUnliked = [...state.workReviews];
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
      return assignToEmpty(state, {workReviews: reviewsCopyUnliked});
    }

    case types.CHECK_ORDER_POLICY: {
      let newState = {
        responses: state.responses + 1,
        orderPolicy: state.orderPolicy
      };

      if (action.pid.pids && action.pid.errors && action.pid.errors.length < 1) {
        newState.orderPolicy[action.pid.pids] = action.pid.orderPossible;
      }

      return assignToEmpty(state, newState);
    }

    case types.WORK_IS_ORDERING: {
      return assignToEmpty(state, {
        orderState: 1
      });
    }

    case types.WORK_HAS_ORDERED: {
      let newOrderState = 2;

      if (action.errors && action.errors.length > 0) {
        newOrderState = 3;

        if (action.errors[0] === 'borrower_not_found') {
          newOrderState = 4;
        }
      }

      return assignToEmpty(state, {
        orderState: newOrderState
      });
    }

    default: {
      return state;
    }
  }
}
