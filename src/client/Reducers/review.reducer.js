/**
 * @file: Profile reducer
 */

import parseJsonData from '../Utils/parseJsonData';
import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';
import {includes, filter, isArray} from 'lodash';

const userReviewsJson = parseJsonData('JSONDATA', 'userReviews') || [];

const initialState = {};
initialState.reviewExplorer = {isLoading: false, reviews: [], total: 0};
initialState.userReviews = userReviewsJson && isArray(userReviewsJson) ? userReviewsJson : [];
initialState.workReviews = parseJsonData('JSONDATA', 'workReviews') || [];  // reviews related to a work (known as collecton in the service provider)
initialState.workReviewsMeta = parseJsonData('JSONDATA', 'workReviewsMeta') || [];  // metadata about workReviews (ownReviewIdd and totalCount)
initialState.highlightedReview = parseJsonData('JSONDATA', 'highlightedReview');

export default function reviewReducer(state = initialState, action = {}) {
  Object.freeze(state);

  switch (action.type) {
    case types.GET_GENRES: {
      return assignToEmpty(state, {
        reviewExplorer: assignToEmpty(state.reviewExplorer, {
          genres: action.genres
        })
      });
    }

    case types.GET_REVIEWS: {
      return assignToEmpty(state, {
        reviewExplorer: assignToEmpty(state.reviewExplorer, {
          reviews: action.reviews,
          total: action.total,
          isLoading: false
        })
      });
    }

    case types.GET_REVIEWS_IS_LOADING: {
      return assignToEmpty(state, {
        reviewExplorer: assignToEmpty(state.reviewExplorer, {
          isLoading: true,
          reviews: action.loadMore ? state.reviewExplorer.reviews : [],
          total: action.loadMore ? state.reviewExplorer.total : 0
        })
      });
    }

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
        if (!review.reviewId) {
          return false;
        }

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
      if (state.highlightedReview &&
        state.highlightedReview.id === action.reviewId &&
        !includes(state.highlightedReview.likes, action.profileId)) {

        return assignToEmpty(state, {
          highlightedReview: assignToEmpty(state.highlightedReview, {likes: [...state.highlightedReview.likes, action.profileId]})
        });
      }
      if (state.workReviews.map) {
        const workReviewsCopyLiked = state.workReviews.map(review => {
          if (review.id === action.reviewId && !includes(review.likes, action.profileId)) {
            return assignToEmpty(review, {likes: [...review.likes, action.profileId]});
          }
          return review;
        });
        return assignToEmpty(state, {workReviews: workReviewsCopyLiked});
      }
      if (state.reviewExplorer.reviews) {
        const copy = state.reviewExplorer.reviews.map(r => {
          const review = r.review;
          if (review.id === action.reviewId && !includes(review.likes, action.profileId)) {
            return assignToEmpty(r, {review: assignToEmpty(review, {likes: [action.profileId, ...review.likes]})});
          }
          return r;
        });
        return assignToEmpty(state, {reviewExplorer: assignToEmpty(state.reviewExplorer, {reviews: copy})});
      }
      return state;
    }

    case types.UNLIKE_WORK_REVIEW: {
      if (state.highlightedReview &&
        state.highlightedReview.id === action.reviewId) {

        return assignToEmpty(state, {
          highlightedReview: assignToEmpty(state.highlightedReview, {likes: filter(state.highlightedReview.likes, (id) => (id !== action.profileId))})
        });
      }
      if (state.workReviews.map) {
        const reviewsCopyUnliked = state.workReviews.map(review => {
          if (review.id === action.reviewId && includes(review.likes, action.profileId)) {
            return assignToEmpty(review, {likes: filter(review.likes, (id) => (id !== action.profileId))});
          }
          return review;
        });
        return assignToEmpty(state, {workReviews: reviewsCopyUnliked});
      }
      if (state.reviewExplorer.reviews) {
        const copy = state.reviewExplorer.reviews.map(r => {
          const review = r.review;
          if (review.id === action.reviewId) {
            return assignToEmpty(r, {review: assignToEmpty(review, {likes: filter(review.likes, (id) => (id !== action.profileId))})});
          }
          return r;
        });
        return assignToEmpty(state, {reviewExplorer: assignToEmpty(state.reviewExplorer, {reviews: copy})});
      }
      return state;
    }

    default: {
      return state;
    }
  }
}
