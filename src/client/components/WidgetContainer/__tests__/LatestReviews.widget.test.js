/**
 * @file: This file contains tests for the Latest Reviews widget.
 **/

// import libs
import React from 'react';
import expect from 'expect';
import $ from 'teaspoon';

// import components
import WidgetContainer from '../WidgetContainer.component';

// import mocks
import {singleReviewMock} from '../__mocks__/Review.mock';

describe('Test LatestReviews Widget', () => {
  it('Test LatestReviews widget can render inside a WidgetContainer', () => {
    const widgetLocationName = 'test-latest-review-widget-location';
    let widgetState = {
      LatestReviews: [],
      widgetLocations: {}
    };
    const widgetActions = {
      asyncGetLatestReviews: () => {},
      asyncListenForCoverImages: () => {}
    };

    widgetState.widgetLocations[widgetLocationName] = {
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        displayTitle: 'LatestReviews displayTitle Test!',
        reviewsToLoad: 15
      }
    };

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    let $root = $(component).render();

    const LatestReviewsWidget = $root.find('.latest-reviews-widget--widget-title--and--show-more-button--container > h2').text();
    expect(LatestReviewsWidget).toEqual('LatestReviews displayTitle Test!');
  });

  it('Test LatestReviews can render with a review.', () => {
    const widgetLocationName = 'test-latest-review-widget-location';

    let widgetState = {
      LatestReviews: [singleReviewMock],
      widgetLocations: {}
    };

    const widgetActions = {
      asyncGetLatestReviews: () => {},
      asyncListenForCoverImages: () => {},
      asyncGetCoverImage: () => {}
    };

    widgetState.widgetLocations[widgetLocationName] = {
      widgetName: 'LatestReviewsWidget',
      widgetConfig: {
        displayTitle: 'Brugerne Siger!',
        reviewsToLoad: 1
      }
    };

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions}/>
    );

    let $root = $(component).render();

    const reviewAuthorString = $root.find('.compact-review--review-author').text();
    expect(reviewAuthorString).toEqual('Anmeldelse af: ');

    const reviewStars = $root.find('.compact-review--review-content--rating').text();
    expect(reviewStars).toEqual('★★★★★★');
  });
});
