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
      expanded: false,
      reviews: Object.values(props.widgetReducerProp.reviews)
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) || !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp) || !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  componentWillReceiveProps(nextProps) {
    const reviews = Object.values(nextProps.widgetReducerProp.reviews);
    this.setState({
      reviews
    });
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

  renderReview(review, work) {
    if (review && work) {
      const coverUrl = work.coverUrlFull && work.coverUrlFull[0] || `/images/covers/${work.workType}.png`;

      return (
        <div className="editorial-reviews--review-container">
        <div key={`review_${review.id}`} className="editorial-reviews--review">
          <div className="editorial-reviews--review--left">
            <a className="editorial-reviews--review--profile-image" href={`/profil/${review.owner.id}`}>
              <img src={review.owner.image}/>
            </a>

            <div className="editorial-reviews--review--cover-image">
              <img src={coverUrl}/>
            </div>
          </div>

          <div className="editorial-reviews--review--right">
            <div className="main-content">
            <a className="editorial-reviews--review--profile-display-name--container" href={`/profil/${review.owner.id}`}>
              <span
                className="editorial-reviews--review--profile-display-name"
                dangerouslySetInnerHTML={{__html: review.owner.displayName}}
              /> anmelder:
            </a>
            <h4 className="editorial-reviews--review--work-title">
              {work.dcTitle}
            </h4>

            <div className="editorial-reviews--review--rating-container">
              <Rating pid={review.pid} rating={review.rating}/>
            </div>

            <div className="editorial-reviews--review--content">
              "<span dangerouslySetInnerHTML={{__html: review.html}}/>"
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

    return <span key={`review_${review.id}`}/>;
  }

  render() {
    const reviews = this.state.reviews.slice(0, this.state.expanded && this.state.reviews.length || 2);
    const works = this.props.widgetReducerProp.works;
    const showMoreButton = reviews.length > 0 && Object.keys(works).length > 0;

    return (
      <div className="editorially-selected-reviews-widget">
        <div className="editorially-selected-reviews-widget-container">
          {reviews.map(review => this.renderReview(review, works[review.pid]))}
        </div>


        {showMoreButton &&
        <div className="editorially-selected-reviews-widget--show-more-button">
          <a
            onClick={() => this.setState({expanded: !this.state.expanded})}>
            <Icon glyph={this.state.expanded ? minusSvg : plusSvg}/>
            {this.state.expanded ? ' VIS FÆRRE' : ' VIS FLERE'}
          </a>
        </div>
        ||
        <div className="editorially-selected-reviews-widget--spinner-container">
          <Icon glyph={spinnerSvg} height={150} width={150}/>
        </div>
        }
      </div>
    );
  }
}

EditoriallySelectedReviewsWidget.displayName = 'EditoriallySelectedReviewsWidget';
