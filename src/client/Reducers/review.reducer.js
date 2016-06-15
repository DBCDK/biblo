/**
 * @file: Profile reducer
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';
import {includes, filter, isArray} from 'lodash';

const userReviewsJson = parseJsonData('JSONDATA', 'userReviews') || [];

const initialState = {};
initialState.userReviews = userReviewsJson && isArray(userReviewsJson) ? userReviewsJson : [];
initialState.workReviews = parseJsonData('JSONDATA', 'workReviews') || [];  // reviews related to a work (known as collecton in the service provider)
initialState.workReviewsMeta = parseJsonData('JSONDATA', 'workReviewsMeta') || [];  // metadata about workReviews (ownReviewIdd and totalCount)

export default function reviewReducer(state = initialState, action = {}) {
  Object.freeze(state);

  switch (action.type) {
    case types.GET_WORK_REVIEWS: {
      return assignToEmpty(state, {
        workReviews: action.reviews.data,
        workReviewsMeta: assignToEmpty(state.workReviewsMeta, {
          workReviewsLoading: false,
          limit: action.limit,
          workReviewsTotalCount: action.workReviewsTotalCount,
          ownReviewId: action.ownId || state.workReviewsMeta.ownReviewId
        })
      });
    }

    case types.GET_WORK_REVIEWS_IS_LOADING: {
      return assignToEmpty(state, {
        workReviewsMeta: assignToEmpty(state.workReviewsMeta, {
          workReviewsLoading: true
        })
      });
    }
    case types.CREATE_WORK_REVIEW: {
      return assignToEmpty(state, {
        workReviews: [action.review, ...state.workReviews],
        workReviewsMeta: assignToEmpty(state.workReviewsMeta, {
          workReviewsTotalCount: state.workReviewsTotalCount + 1,
          workReviewsLoading: false
        })
      });
    }

    case types.DELETE_WORK_REVIEW: {
      let reviewsAfterDelete = [...state.workReviews];
      reviewsAfterDelete = filter(reviewsAfterDelete, (review) => {
        return (review.reviewId !== action.reviewId);
      });

      // note: we can get here as an admin deleting another users review
      let ownReviewId;
      if (action.reviewId !== state.workReviewsMeta.ownReviewId) {
        ownReviewId = state.workReviewsMeta.ownReviewId;
      }

      return assignToEmpty(state, {
        workReviewsMeta: assignToEmpty(state.workReviewsMeta, {
          workReviewsTotalCount: state.workReviewsTotalCount - 1,
          ownReviewId: ownReviewId
        }),
        workReviews: reviewsAfterDelete
      });
    }

    case types.LIKE_WORK_REVIEW: {
      const workReviewsCopyLiked = [...state.workReviews];
      workReviewsCopyLiked.forEach(review => {
        if (review.id === action.reviewId) {
          const isAlreadyLikedByUser = includes(review.likes, action.profileId);
          if (!isAlreadyLikedByUser) {
            review.likes.push(action.profileId);
          }
        }
      });
      return assignToEmpty(state, {workReviews: workReviewsCopyLiked});
    }

    case types.UNLIKE_WORK_REVIEW: {
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

    default: {
      return state;
    }
  }
}
