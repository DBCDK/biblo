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
  LatestReviews: {
    reviews: [],
    campaignReviews: {},
    campaign: {},
    reviewsPending: true
  },
  CoverImages: {},
  BestRatedWorksWidget: {
    works: [],
    isLoading: true
  },
  LatestGroupPostsWidget: {
    posts: {},
    groups: {},
    groupLoading: true,
    postsLoading: true,
    isLoading: true
  },
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
    case types.GET_LATEST_REVIEWS_FOR_WIDGET: {
      const LatestReviews = state.LatestReviews;
      LatestReviews.reviews = action.reviews;
      LatestReviews.reviewsPending = false;
      return assignToEmpty(state, {LatestReviews: LatestReviews});
    }

    case types.GOT_COVER_IMAGE_FROM_PID_FOR_WIDGET: {
      return assignToEmpty(state, {CoverImages: assignToEmpty(state.CoverImages, action.coverImageResult)});
    }

    case types.GOT_BEST_RATED_WORKS: {
      return assignToEmpty(state, {BestRatedWorksWidget: {works: action.data.data, isLoading: false}});
    }

    case types.GOT_CAMPAIGN_REVIEWS: {
      const LatestReviews = state.LatestReviews;
      if (action.data.status === 200) {
        LatestReviews.campaignReviews[action.data.campaignId] = action.data.data;
        LatestReviews.reviewsPending = false;
      }

      return assignToEmpty(state, LatestReviews);
    }

    case types.GOT_CAMPAIGN: {
      const LatestReviews = state.LatestReviews;
      if (action.data.statusCode === 200) {
        LatestReviews.campaign = action.data.body;
      }

      return assignToEmpty(state, {LatestReviews});
    }

    case types.GOT_GROUP: {
      const LatestGroupPostsWidget = state.LatestGroupPostsWidget;
      if (action.data.id) {
        LatestGroupPostsWidget.groups[action.data.id] = action.data;
        LatestGroupPostsWidget.groupLoading = false;
        LatestGroupPostsWidget.isLoading = LatestGroupPostsWidget.postsLoading;
      }

      return assignToEmpty(state, LatestGroupPostsWidget);
    }

    case types.GOT_POSTS: {
      const LatestGroupPostsWidget = state.LatestGroupPostsWidget;
      if (Array.isArray(action.data)) {
        action.data.forEach(post => {
          const groupId = post.groupid;
          if (!LatestGroupPostsWidget.posts[groupId]) {
            LatestGroupPostsWidget.posts[groupId] = [];
          }

          LatestGroupPostsWidget.posts[groupId].push(post);
        });
      }

      LatestGroupPostsWidget.postsLoading = false;
      LatestGroupPostsWidget.isLoading = LatestGroupPostsWidget.groupLoading;

      return assignToEmpty(state, LatestGroupPostsWidget);
    }

    default:
      return state;
  }
}
