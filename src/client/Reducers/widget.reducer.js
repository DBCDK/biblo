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
    reviewsCount: 0,
    reviews: [],
    campaignReviews: {},
    campaigns: {},
    reviewsPending: true
  },
  CoverImages: {},
  BestRatedWorksWidget: {
    works: [],
    isLoading: true,
    more: true
  },
  LatestGroupPostsWidget: {
    posts: {},
    groups: {},
    groupLoading: true,
    postsLoading: true,
    isLoading: true,
    postsCount: 0
  },
  LatestPostsWidget: {
    posts: [],
    postsLoading: true
  },
  PopularGroupsWidget: {
    groups: [],
    isLoading: true,
    count: 0
  },
  EditoriallySelectedReviewsWidget: {
    works: {},
    reviews: {},
    isLoading: true
  },
  EditoriallySelectedMaterialsWidget: {
    works: {}
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
      return assignToEmpty(state, {
        LatestReviews: assignToEmpty(state.LatestReviews, {
          reviewsCount: action.reviewsCount,
          reviews: state.LatestReviews.reviews.concat(action.reviews),
          reviewsPending: false
        })
      });
    }

    case types.GOT_COVER_IMAGE_FROM_PID_FOR_WIDGET: {
      return assignToEmpty(state, {CoverImages: assignToEmpty(state.CoverImages, action.coverImageResult)});
    }

    case types.GOT_BEST_RATED_WORKS: {
      return assignToEmpty(state, {
        BestRatedWorksWidget: {
          works: action.data.data,
          isLoading: false,
          more: action.data.more
        }
      });
    }

    case types.GOT_CAMPAIGN_REVIEWS: {
      const LatestReviews = {
        campaignReviews: {}
      };

      if (action.data.status === 200) {
        LatestReviews.campaignReviews[action.data.campaignId] = (state.LatestReviews.campaignReviews[action.data.campaignId] || []).concat(action.data.data);
        LatestReviews.reviewsPending = false;
      }

      if (state.LatestReviews.campaigns[action.data.campaignId]) {
        state.LatestReviews.campaigns[action.data.campaignId].reviewsCount = action.data.reviewsCount;
      }

      return assignToEmpty(state, {
        LatestReviews: assignToEmpty(state.LatestReviews, LatestReviews)
      });
    }

    case types.GOT_CAMPAIGN: {
      const LatestReviews = {campaigns: assignToEmpty(state.LatestReviews.campaigns, {})};
      if (action.data.statusCode === 200 && !LatestReviews.campaigns[action.data.body.id]) {
        LatestReviews.campaigns[action.data.body.id] = assignToEmpty({reviewsCount: 0}, action.data.body);
      }

      return assignToEmpty(state, {
        LatestReviews: assignToEmpty(state.LatestReviews, LatestReviews)
      });
    }

    case types.GOT_GROUP: {
      const LatestGroupPostsWidget = assignToEmpty(state.LatestGroupPostsWidget, {});
      if (action.data.id) {
        LatestGroupPostsWidget.groups[action.data.id] = action.data;
        LatestGroupPostsWidget.groupLoading = false;
        LatestGroupPostsWidget.isLoading = state.LatestGroupPostsWidget.postsLoading;
      }

      return assignToEmpty(state, {
        LatestGroupPostsWidget
      });
    }

    case types.GOT_POSTS: {
      const LatestGroupPostsWidget = assignToEmpty(state.LatestGroupPostsWidget, {});
      if (Array.isArray(action.data)) {
        action.data.forEach(post => {
          const groupId = post.groupid;
          if (!LatestGroupPostsWidget.posts[groupId]) {
            LatestGroupPostsWidget.posts[groupId] = [];
          }

          // Need postsCount to trigger rendering, since the posts array, is copied as a reference by assignToEmpty()
          LatestGroupPostsWidget.postsCount++;
          LatestGroupPostsWidget.posts[groupId].push(post);
        });
      }

      LatestGroupPostsWidget.postsLoading = false;
      LatestGroupPostsWidget.isLoading = LatestGroupPostsWidget.groupLoading;

      return assignToEmpty(state, {
        LatestGroupPostsWidget
      });
    }

    case types.GOT_GROUPS: {
      return assignToEmpty(state, {
        PopularGroupsWidget: {
          isLoading: false,
          groups: action.data.groups,
          count: action.data.count
        }
      });
    }

    case types.GOT_WORKS: {
      const newState = Object.assign({}, state.EditoriallySelectedMaterialsWidget);
      const identifier = action.data.requestedPids.join();
      newState.works[identifier] = action.data.data;

      return assignToEmpty(state, {EditoriallySelectedMaterialsWidget: newState});
    }

    case types.GOT_REVIEWS: {
      const EditoriallySelectedReviewsWidget = assignToEmpty(state.EditoriallySelectedReviewsWidget, {});
      EditoriallySelectedReviewsWidget.isLoading = false;
      (action.data.data || []).forEach(review => {
        if (review.id) {
          EditoriallySelectedReviewsWidget.reviews[review.id] = review;
        }
      });

      return assignToEmpty(state, {
        EditoriallySelectedReviewsWidget
      });
    }

    case types.GOT_WORKS_FROM_REVIEWS: {
      const works = action.data.data || [];
      const EditoriallySelectedReviewsWidget = assignToEmpty(state.EditoriallySelectedReviewsWidget, {});
      EditoriallySelectedReviewsWidget.works = assignToEmpty(EditoriallySelectedReviewsWidget.works, {});
      works.forEach(work => {
        (work.collection || []).forEach(pid => {
          EditoriallySelectedReviewsWidget.works[pid] = work;
        });
      });

      return assignToEmpty(state, {
        EditoriallySelectedReviewsWidget
      });
    }

    case types.GOT_LATEST_POSTS: {
      const posts = state.LatestPostsWidget.posts || [];
      return assignToEmpty(state, {
        LatestPostsWidget: {
          posts: posts.concat(action.data),
          postsLoading: false
        }
      });
    }

    default:
      return state;
  }
}
