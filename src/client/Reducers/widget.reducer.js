/**
 * @file: Widget reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {
  LatestReviews: [],
  CoverImages: {},
  widgetLocations: {
    FrontPageTop: [
      {
        widgetName: 'LatestReviewsWidget',
        widgetData: {
          displayTitle: 'Brugerne Siger',
          reviewsToLoad: 15
        }
      }
    ]
  }
};

export default function widgetReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GET_LATEST_REVIEWS_FOR_WIDGET:
      return assignToEmpty(state, {LatestReviews: action.reviews});

    case types.GOT_COVER_IMAGE_FROM_PID_FOR_WIDGET:
      return assignToEmpty(state, {CoverImages: assignToEmpty(state.CoverImages, action.coverImageResult)});

    default:
      return state;
  }
}
