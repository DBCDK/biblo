/**
 * @file: Widget to display a list of the latest reviews.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import isEqual from 'lodash/isEqual';

import {PaginationContainer} from '../../PaginationContainer.component';
import {CompactReviewElement} from './CompactReviewElement.component';

import './scss/LatestReviews.widget.component.scss';

export class LatestReviewsWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.getNextPage = this.getNextPage.bind(this);
  }

  componentDidMount() {
    const widgetConfig = this.props.widgetConfig;

    this.callServiceProvider('getCampaign', {id: widgetConfig.campaignId});
    this.getNextPage(widgetConfig.reviewsToLoad);
    this.props.widgetActions.asyncListenForCoverImages();
  }

  shouldComponentUpdate(nextProps) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp or widgetState cover images.
    return !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp)
      || !isEqual(nextProps.widgetState.CoverImages, this.props.widgetState.CoverImages);
  }

  getNextPage(pageIndex) {
    const widgetConfig = this.props.widgetConfig;
    return this.props.widgetActions.asyncGetLatestReviews(
      'id DESC',
      widgetConfig.reviewsToLoad || 15,
      widgetConfig.campaignId,
      pageIndex - widgetConfig.reviewsToLoad
    );
  }

  render() {
    const widgetConfig = this.props.widgetConfig;
    const wrp = this.props.widgetReducerProp;
    const campaignLogoUrl = wrp.campaigns[widgetConfig.campaignId]
      && wrp.campaigns[widgetConfig.campaignId].logos &&
      wrp.campaigns[widgetConfig.campaignId].logos.small || null;

    let campaignLogo = '';
    if (campaignLogoUrl) {
      campaignLogo = (
        <span className="widget--campaign-logo">
          <img src={campaignLogoUrl} />
        </span>
      );
    }

    let reviewsCount = wrp.reviewsCount;
    let reviews = wrp.reviews;
    if (widgetConfig.campaignId) {
      reviews = wrp.campaignReviews[widgetConfig.campaignId] || [];

      if (wrp.campaigns[widgetConfig.campaignId]) {
        reviewsCount = wrp.campaigns[widgetConfig.campaignId].reviewsCount;
      }
    }

    reviews = reviews.map((review) => {
      return (
        <CompactReviewElement
          key={`compact_review_${review.id}`}
          review={review}
          coverImages={this.props.widgetState.CoverImages || {}}
          getCoverImageAction={this.props.widgetActions.asyncGetCoverImage}/>
      );
    });

    return (
      <div>
        {campaignLogo}
        <div className="latest-reviews-widget--reviews-container">
          {reviews.length === 0 && !wrp.reviewsPending && 'Der er ikke lavet nogen anmeldelser endnu'}

          <PaginationContainer
            nextPageFunction={this.getNextPage}
            pages={reviews}
            lastPageIndex={reviewsCount}
            pageIncrements={widgetConfig.reviewsToLoad}
            genericLoading={true}
          />
        </div>
      </div>
    );
  }
}

LatestReviewsWidget.displayName = 'LatestReviewsWidget';
