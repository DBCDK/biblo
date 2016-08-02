/**
 * @file: This file contains unit tests of the editorially selected reviews widget.
 */

// import libs
import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';

// import mocks
import {emptyState, fiveReviewsState, singleReviewState} from '../__mocks__/SelectedReviews.mock';

describe('Testing of the editorially selected reviews widget', () => {
  it('should render with an empty state', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-editorially-selected-reviews-location',
      widgetName: 'EditoriallySelectedReviewsWidget',
      widgetConfig: emptyState.widgetConfig,
      state: {
        EditoriallySelectedReviewsWidget: emptyState.widgetReducerProp
      }
    });

    // We expect to see the container, but no reviews.
    expect($root.find('.editorially-selected-reviews-widget').length).toEqual(1);
    expect($root.find('.editorial-reviews--review').length).toEqual(0);
  });

  it('should render one review', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-editorially-selected-reviews-location',
      widgetName: 'EditoriallySelectedReviewsWidget',
      widgetConfig: singleReviewState.widgetConfig,
      state: {
        EditoriallySelectedReviewsWidget: singleReviewState.widgetReducerProp
      }
    });

    // We expect to see the container and the review.
    expect($root.find('.editorially-selected-reviews-widget').length).toEqual(1);
    expect($root.find('.editorial-reviews--review').length).toEqual(1);

    // We expect the owners display name is rendered
    expect($root.find('.editorial-reviews--review--profile-display-name').unwrap().innerHTML)
      .toEqual('Test Mesteren!');

    // We expect a work title
    expect($root.find('.editorial-reviews--review--work-title').unwrap().innerHTML)
      .toContain('Harry Styles');

    // We expect to see ratings
    expect($root.find('.star-active').length).toEqual(5);
    expect($root.find('.star-passive').length).toEqual(1);

    // And we expect to see a read review button.
    expect($root.find('.editorial-reviews--review--read-button').unwrap().innerHTML)
      .toEqual('Læs anmeldelsen');
  });

  it('should render a bunch of reviews', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-editorially-selected-reviews-location',
      widgetName: 'EditoriallySelectedReviewsWidget',
      widgetConfig: fiveReviewsState.widgetConfig,
      state: {
        EditoriallySelectedReviewsWidget: fiveReviewsState.widgetReducerProp
      }
    });

    // Initially we display two elements
    expect($root.find('.editorially-selected-reviews-widget').length).toEqual(1);
    expect($root.find('.editorial-reviews--review').length).toEqual(2);

    // We click show more
    $root.find('.editorially-selected-reviews-widget--show-more-button').trigger('click', {});

    // And now we display all five elements.
    expect($root.find('.editorial-reviews--review').length).toEqual(5);
  });
});
