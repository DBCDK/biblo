/**
 * @file: Widget reducer
 */

import assignToEmpty from '../Utils/assign';
import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';

/**
 * Create a widgetLocation for contentPageLeft and fill with widgets from json.
 */
let initialState = {
  LatestReviews: [],
  CoverImages: {},
  widgetLocations: {
    ContentPageLeft: [],
    ContentPageFactBox: [],
    FrontPageContent: []
  }
};

let FrontPageWidgetLocations = parseJsonData('JSONDATA', 'widgetLocations');
initialState.widgetLocations = Object.assign(initialState.widgetLocations, FrontPageWidgetLocations);

let ContentPageJSONData = parseJsonData('JSONDATA', 'contentPageData');
initialState.widgetLocations = Object.assign(initialState.widgetLocations, ContentPageJSONData.widgetLocations);

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
