/**
 * @file: This file contains unit tests of the editorially selected reviews widget.
 */

// import libs
import {expect} from 'chai';
import {renderWidgetWithEnzyme} from './widgetTest.utils';

// import mocks
import {emptyState, fiveReviewsState, singleReviewState} from '../__mocks__/SelectedReviews.mock';

describe('Testing of the editorially selected reviews widget', () => {
  it('should render with an empty state', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-editorially-selected-reviews-location',
      widgetName: 'EditoriallySelectedReviewsWidget',
      widgetConfig: emptyState.widgetConfig,
      state: {
        EditoriallySelectedReviewsWidget: emptyState.widgetReducerProp
      }
    });

    // We expect to see the container, but no reviews.
    expect(wrapper.find('.editorially-selected-reviews-widget').length).to.equal(1);
    expect(wrapper.find('.editorial-reviews--review').length).to.equal(0);
  });

  it('should render one review', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-editorially-selected-reviews-location',
      widgetName: 'EditoriallySelectedReviewsWidget',
      widgetConfig: singleReviewState.widgetConfig,
      state: {
        EditoriallySelectedReviewsWidget: singleReviewState.widgetReducerProp
      }
    });

    // We expect to see the container and the review.
    expect(wrapper.find('.editorially-selected-reviews-widget').length).to.equal(1);
    expect(wrapper.find('.editorial-reviews--review').length).to.equal(1);

    // We expect the owners display name is rendered
    expect(wrapper.find('.widget-element--author a').text())
      .to.equal('Test Mesteren!');

    // We expect a work title
    expect(wrapper.find('.editorial-reviews--review--work-title').text())
      .to.contain('Harry Styles');

    // We expect to see ratings
    expect(wrapper.find('.star-active').length).to.equal(5);
    expect(wrapper.find('.star-passive').length).to.equal(1);

    // We should not see a show more button
    expect(wrapper.find('.editorially-selected-reviews-widget--show-more-button').length).to.equal(0);

    // And we expect to see a read review button.
    expect(wrapper.find('.editorial-reviews--read-button a').text())
      .to.equal('Læs anmeldelsen');
  });

  it('should render a bunch of reviews', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-editorially-selected-reviews-location',
      widgetName: 'EditoriallySelectedReviewsWidget',
      widgetConfig: fiveReviewsState.widgetConfig,
      state: {
        EditoriallySelectedReviewsWidget: fiveReviewsState.widgetReducerProp
      }
    });

    // Initially we display two elements
    expect(wrapper.find('.editorially-selected-reviews-widget').length).to.equal(1);
    expect(wrapper.find('.editorial-reviews--review-container.expanded').length).to.equal(2);

    // We should see a show more button
    expect(wrapper.find('.editorially-selected-reviews-widget--show-more-button').length).to.equal(1);

    // We click show more
    wrapper.find('.editorially-selected-reviews-widget--show-more-button a').simulate('click', {});

    // And now we display all five elements.
    expect(wrapper.find('.editorial-reviews--review-container.expanded').length).to.equal(5);

    // Here we check if all elements are rendered in the correct order.
    const reviewHtmlIds = wrapper.find('.editorial-reviews--review-container').map(elem => {
      return elem.children().first().prop('id');
    });

    fiveReviewsState.widgetConfig.reviewIds.map((reviewId, idx) => {
      expect(reviewHtmlIds[idx]).to.contain(reviewId);
    });
  });
});
