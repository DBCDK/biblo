/**
 * @file: Widget to display a list of the latest reviews.
 */

import {Component, PropTypes} from 'react';
import {CompactReviewElement} from './CompactReviewElement.component';

import './LatestReviews.widget.component.scss';

export class LatestReviewsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.widgetActions.asyncGetLatestReviews('id DESC', this.props.widgetData.reviewsToLoad || 15);
    this.props.widgetActions.asyncListenForCoverImages();
  }

  render() {
    let {displayTitle} = this.props.widgetData;
    let reviews = this.props.widgetReducerProp;

    reviews = reviews.map((review) => {
      return (
        <CompactReviewElement 
          key={`compact_review_${review.id}`} 
          review={review}
          coverImages={this.props.widgetState.CoverImages || {}}
          getCoverImageAction={this.props.widgetActions.asyncGetCoverImage} />
      );
    });

    return (
      <div>
        <h2>{displayTitle}</h2>
        <div className="latest-reviews-widget--reviews-container">
          {reviews}
        </div>
      </div>
    );
  }
}

LatestReviewsWidget.displayName = 'LatestReviewsWidget';
LatestReviewsWidget.propTypes = {
  widgetLocationName: PropTypes.string.isRequired,
  widgetState: PropTypes.object.isRequired,
  widgetActions: PropTypes.object.isRequired,
  widgetReducerProp: PropTypes.array.isRequired,
  widgetData: PropTypes.object.isRequired
};
