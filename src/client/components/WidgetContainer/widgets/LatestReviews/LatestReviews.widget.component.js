/**
 * @file: Widget to display a list of the latest reviews.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {isEqual} from 'lodash';

import {CompactReviewElement} from './CompactReviewElement.component';
import Icon from '../../../General/Icon/Icon.component';

import plusSvg from '../../../General/Icon/svg/functions/plus.svg';
import minusSvg from '../../../General/Icon/svg/functions/minus.svg';

import './scss/LatestReviews.widget.component.scss';

export class LatestReviewsWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.state = {
      isClosed: true
    };
  }

  componentDidMount() {
    const widgetConfig = this.props.widgetConfig;

    this.callServiceProvider('getCampaign', {id: widgetConfig.campaignId});
    this.props.widgetActions.asyncGetLatestReviews('id DESC', widgetConfig.reviewsToLoad || 15, widgetConfig.campaignId);
    this.props.widgetActions.asyncListenForCoverImages();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp or widgetState cover images.
    return !isEqual(nextState, this.state) || !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp)
      || !isEqual(nextProps.widgetState.CoverImages, this.props.widgetState.CoverImages);
  }

  render() {
    const campaignLogoUrl = this.props.widgetReducerProp.campaign && this.props.widgetReducerProp.campaign.logos && this.props.widgetReducerProp.campaign.logos.small || null;
    let campaignLogo = '';
    if (campaignLogoUrl) {
      campaignLogo = (
        <span className="latest-reviews-widget--campaign-logo">
          <img src={campaignLogoUrl} />
        </span>
      );
    }

    let reviews = this.props.widgetReducerProp.reviews;
    let classNames = 'latest-reviews-widget--reviews-container';

    if (this.props.widgetConfig.campaignId) {
      reviews = this.props.widgetReducerProp.campaignReviews[this.props.widgetConfig.campaignId] || [];
    }

    if (this.state.isClosed) {
      classNames += ' closed';
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
        <div className={classNames}>
          {reviews.length === 0 && !this.props.widgetReducerProp.reviewsPending && 'Der er ikke lavet nogen anmeldelser endnu'}
          {reviews}
        </div>
        <div className="latest-reviews-widget--show-more-button--container">
          <a
            className="latest-reviews-widget--show-more-button"
            onClick={() => this.setState({isClosed: !this.state.isClosed})}>
            <Icon glyph={this.state.isClosed ? plusSvg : minusSvg}/>
            {this.state.isClosed ? ' VIS FLERE' : ' VIS FÆRRE'}
          </a>
          <hr />
        </div>
      </div>
    );
  }
}

LatestReviewsWidget.displayName = 'LatestReviewsWidget';
