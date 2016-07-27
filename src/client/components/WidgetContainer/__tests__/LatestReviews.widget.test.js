/**
 * @file: This file contains tests for the Latest Reviews widget.
 **/

// import libs
import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';

// import mocks
import {singleReviewMock, singleCampaignReviewMock} from '../__mocks__/Review.mock';

describe('Test LatestReviews Widget', () => {
  it('Test LatestReviews widget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-latest-review-widget-location',
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        displayTitle: 'LatestReviews displayTitle Test!',
        showTitle: true
      },
      state: {
        LatestReviews: {
          reviews: []
        }
      }
    });

    const LatestReviewsWidget = $root.find('h2').text();
    expect(LatestReviewsWidget).toEqual('LatestReviews displayTitle Test!');
  });

  it('Test LatestReviews can render with a review.', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-latest-review-widget-location',
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        displayTitle: 'Brugerne Siger!',
        reviewsToLoad: 1,
        showTitle: true
      },
      state: {
        LatestReviews: {
          reviews: [singleReviewMock]
        }
      }
    });

    const reviewStars = $root.find('.compact-review--review-content--rating').text();
    expect(reviewStars).toEqual('★★★★★★');
  });

  it('Should render a campaign logo when a campaign is attached', () => {
    const coverImagesState = {};
    coverImagesState[singleCampaignReviewMock.pid] = '/images/covers/book.png';

    const $root = renderWidgetWithTeaspoon({
      location: 'test-latest-review-widget-location',
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        reviewsToLoad: 1,
        campaignId: 1
      },
      state: {
        LatestReviews: {
          reviews: [],
          campaignReviews: {
            1: [singleCampaignReviewMock]
          },
          campaign: singleCampaignReviewMock.campaign,
          reviewsPending: false
        },
        CoverImages: coverImagesState
      }
    });

    const campaignLogoSrc = $root.find('.latest-reviews-widget--campaign-logo > img').unwrap().src;
    expect(campaignLogoSrc).toContain(singleCampaignReviewMock.campaign.logos.small);
  });
});
