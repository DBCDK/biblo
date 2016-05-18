/**
 * @file: Widget reducer
 */

import assignToEmpty from '../Utils/assign';
import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';

/**
 * Create a widgetLocation for contentPageLeft and fill with widgets from json.
 */
let ContentPageJSONData = parseJsonData('JSONDATA', 'contentPageData');
let ContentPageLeft = ContentPageJSONData && ContentPageJSONData.field_content && ContentPageJSONData.field_content.map((contentField) => {
  let widgetName;
  let widgetData = {};

  if (contentField.text) {
    widgetName = 'ContentPageTextWidget';
    widgetData.content = contentField.text;
  }
  else if (contentField.image) {
    widgetName = 'ContentPageImageWidget';
    widgetData.alt = contentField.image.alt;
    widgetData.title = contentField.image.title;
    widgetData.src = contentField.image.original;
  }
  else if (contentField.embedded_video) {
    widgetName = 'ContentPageEmbeddedVideoWidget';
    widgetData.src = contentField.embedded_video.url;
    widgetData.type = contentField.embedded_video.type;
  }

  return {
    widgetName,
    widgetData
  }
}) || [];

if (ContentPageJSONData && ContentPageJSONData.title) {
  ContentPageLeft.unshift({widgetName: 'ContentPageTextWidget', widgetData: {content: `<h2>${ContentPageJSONData.title}</h2>`}});
}

let initialState = {
  LatestReviews: [],
  CoverImages: {},
  widgetLocations: {
    ContentPageLeft,
    ContentPageFactBox: [],
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
