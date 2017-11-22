/**
 * @file: This file contains tests for the Latest Reviews widget.
 **/

// import libs
import {expect} from 'chai';
import {renderWidgetWithEnzyme} from './widgetTest.utils';

// import mocks
import {singleReviewMock, singleCampaignReviewMock} from '../__mocks__/Review.mock';

describe('Test LatestReviews Widget', () => {
  it('Test LatestReviews widget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithEnzyme({
      location: 'test-latest-review-widget-location',
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        displayTitle: 'LatestReviews displayTitle Test!',
        showTitle: true
      },
      state: {
        LatestReviews: {
          campaigns: {},
          reviews: []
        }
      }
    });

    const LatestReviewsWidget = $root.find('h2').text();
    expect(LatestReviewsWidget).to.equal('LatestReviews displayTitle Test!');
  });

  it('Test LatestReviews can render with a review.', () => {
    const $root = renderWidgetWithEnzyme({
      location: 'test-latest-review-widget-location',
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        displayTitle: 'Brugerne Siger!',
        reviewsToLoad: 1,
        showTitle: true
      },
      state: {
        LatestReviews: {
          campaigns: {},
          reviews: [singleReviewMock]
        }
      }
    });

    const reviewStars = $root.find('.compact-review--review-content--rating').text();
    expect(reviewStars).to.equal('★★★★★★');
  });

  it('Should render a campaign logo when a campaign is attached', () => {
    const coverImagesState = {};
    coverImagesState[singleCampaignReviewMock.pid] = '/images/covers/book.png';

    const wrapper = renderWidgetWithEnzyme({
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
          campaigns: {
            1: singleCampaignReviewMock.campaign
          },
          reviewsPending: false
        },
        CoverImages: coverImagesState
      }
    });

    const campaignLogoSrc = wrapper.find('.widget--campaign-logo').find('img').prop('src');
    expect(campaignLogoSrc).to.contain(singleCampaignReviewMock.campaign.logos.small);
  });
});
