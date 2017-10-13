/**
 * @file: implements EditoriallySelectedReviewsWidget, renders pre selected reviews from widgetConfig.
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {isEqual} from 'lodash';

import {AbstractWidget} from '../../AbstractWidget.component';
import Rating from '../../../General/Rating/Rating.component';
import Icon from '../../../General/Icon/Icon.component';

import plusSvg from '../../../General/Icon/svg/functions/plus.svg';
import minusSvg from '../../../General/Icon/svg/functions/minus.svg';
import spinnerSvg from '../../../General/Icon/svg/spinners/loading-spin.svg';

import './scss/EditoriallySelectedReviews.widget.component.scss';

export class EditoriallySelectedReviewsWidget extends AbstractWidget {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) || !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp) || !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  componentDidMount() {
    const reviewIds = this.props.widgetConfig.reviewIds;
    const maxChars = 100;

    this.callServiceProvider('getReviews', {
      skip: 0,
      limit: reviewIds.length,
      where: {
        markedAsDeleted: null,
        or: reviewIds.map(id => ({id}))
      },
      limitReviewContent: maxChars
    });

    this.callServiceProvider('getWorkFromReviewIds', {ids: reviewIds});
  }

  renderReview(review = null, work = null, idx = 0, hide = false) {
    if (review && work) {
      const coverUrl = work.coverUrlFull && work.coverUrlFull[0] || `/images/covers/${work.workType}.png`;
      const containerClass = 'editorial-reviews--review-container' + (hide ? '' : ' expanded');

      return (
        <div key={`review_${review.id}_${idx}`} className={containerClass}>
          <div className="editorial-reviews--review" id={`review_${review.id}`}>
            <div className="editorial-reviews--review--left">
              <a className="editorial-reviews--review--profile-image" href={`/profil/${review.owner.id}`}>
                <img src={review.owner.image} />
              </a>

              <div className="editorial-reviews--review--cover-image">
                <img src={coverUrl} />
              </div>
            </div>

            <div className="editorial-reviews--review--right">
              <div className="main-content">
                <div className="widget-element--author">
                  Af:
                  <a dangerouslySetInnerHTML={{__html: review.owner.displayName}} href={`/profil/${review.owner.id}`} />
                </div>
                <h4 className="editorial-reviews--review--work-title">
                  {work.dcTitle}
                </h4>

                <div className="editorial-reviews--review--rating-container">
                  <Rating pid={review.pid} rating={review.rating} />
                </div>

                <div className="editorial-reviews--review--content">
                  "<span dangerouslySetInnerHTML={{__html: review.html}} />"
                </div>
              </div>
              <div className="editorial-reviews--read-button">
                <a href={`/anmeldelse/${review.id}`}>
                  Læs anmeldelsen
                </a>
              </div>
            </div>

          </div>
        </div>
      );
    }

    return null;
  }

  getSpinner() {
    return (
      <div className="editorially-selected-reviews-widget--spinner-container">
        <Icon glyph={spinnerSvg} height={150} width={150} />
      </div>
    );
  }

  getShowMoreButton() {
    return (
      <div className="editorially-selected-reviews-widget--show-more-button">
        <a
          onClick={() => this.setState({expanded: !this.state.expanded})}>
          <Icon glyph={this.state.expanded ? minusSvg : plusSvg} />
          {this.state.expanded ? ' VIS FÆRRE' : ' VIS FLERE'}
        </a>
      </div>
    );
  }

  render() {
    const reviews = this.props.widgetReducerProp.reviews;
    const reviewIds = this.props.widgetConfig.reviewIds;
    const works = this.props.widgetReducerProp.works;

    const showMoreButton = Object.keys(reviews).length > 2 ?
      this.getShowMoreButton() :
      null;

    const spinner = this.props.widgetReducerProp.isLoading ? this.getSpinner() : null;

    const reviewElements = reviewIds.map((reviewId, idx) => {
      if (reviews[reviewId] && reviews[reviewId].pid && works[reviews[reviewId].pid]) {
        return this.renderReview(reviews[reviewId], works[reviews[reviewId].pid], idx, !(this.state.expanded || idx < 2));
      }

      return <span className="review_not_found" key={`review_${reviewId}_${idx}_not_found`} />;
    });

    return (
      <div className="editorially-selected-reviews-widget">
        <div className="editorially-selected-reviews-widget-container">
          {reviewElements}
        </div>

        {spinner}
        {showMoreButton}
      </div>
    );
  }
}

EditoriallySelectedReviewsWidget.displayName = 'EditoriallySelectedReviewsWidget';
