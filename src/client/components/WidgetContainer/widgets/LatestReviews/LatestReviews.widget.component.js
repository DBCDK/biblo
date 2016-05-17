/**
 * @file: Widget to display a list of the latest reviews.
 */

import {Component, PropTypes} from 'react';

import {CompactReviewElement} from './CompactReviewElement.component';
import Icon from '../../../General/Icon/Icon.component';

import plusSvg from '../../../General/Icon/svg/functions/plus.svg';

import './LatestReviews.widget.component.scss';

export class LatestReviewsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClosed: true
    };
  }

  componentDidMount() {
    this.props.widgetActions.asyncGetLatestReviews('id DESC', this.props.widgetData.reviewsToLoad || 15);
    this.props.widgetActions.asyncListenForCoverImages();
  }

  render() {
    let {displayTitle} = this.props.widgetData;
    let reviews = this.props.widgetReducerProp;
    let classNames = 'latest-reviews-widget--reviews-container';

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
        <div className="latest-reviews-widget--widget-title--and--show-more-button--container">
          <h2>{displayTitle}</h2>
          <a
            className="latest-reviews-widget--show-more-button"
            onClick={() => this.setState({isClosed: !this.state.isClosed})}>
            <Icon glyph={plusSvg} />
            {this.state.isClosed ? ' VIS FLERE' : ' VIS FÆRRE'}
          </a>
        </div>
        <div className={classNames}>
          {reviews}
        </div>
      </div>
    );
  }
}

LatestReviewsWidget.displayName = 'LatestReviewsWidget';
LatestReviewsWidget.propTypes = {
  widgetActions: PropTypes.object.isRequired,
  widgetData: PropTypes.object.isRequired,
  widgetLocationName: PropTypes.string.isRequired,
  widgetReducerProp: PropTypes.array.isRequired,
  widgetState: PropTypes.object.isRequired
};
