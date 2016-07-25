/**
 * @file: This file contains tests for the Latest Reviews widget.
 **/

// import libs
import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';

// import mocks
import {singleReviewMock} from '../__mocks__/Review.mock';

describe('Test LatestReviews Widget', () => {
  it('Test LatestReviews widget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-latest-review-widget-location',
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        displayTitle: 'LatestReviews displayTitle Test!',
        reviewsToLoad: 15,
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
});
