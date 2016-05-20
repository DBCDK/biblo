/**
 * @file Container component that  containes a list of reviews
 */

import React from 'react';

import ReviewRow from './ReviewRow.component';

export default class ReviewsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 10
    };
  }

  componentWillMount() {
    // creating an empty array used for bookkeeping purpose only
    this.requestedPids = [];
  }

  renderReviewRows() {
    let pidsMissingMetadata = [];
    const reviews = this.props.reviews.map((review, index) => {
      if (index + 1 > this.state.limit + 10) {
        return false;
      }

      // store the pid in pidsMissingMetadata if metadata for the given pid is
      // not found and data not already has been requested
      if (!this.props.worksMetadata[review.pid] && this.requestedPids.indexOf(review.pid) === -1) {
        this.requestedPids.push(review.pid);
        pidsMissingMetadata.push(review.pid);

        // if pidsMissingMetadata exceeds 20 pids request metadata for them and
        // empty the array. If coverUrls are requested for to many pids moreinfo
        // will reject the request resulting in an 500
        if (pidsMissingMetadata.length >= 20) {
          this.requestMetadata(pidsMissingMetadata);
          pidsMissingMetadata = [];
        }
      }

      return (
        <ReviewRow
          review={review}
          user={this.props.user}
          key={index}
          metadata={this.props.worksMetadata[review.pid]}
        />
      );
    });

    this.requestMetadata(pidsMissingMetadata);

    return reviews;
  }

  /**
   * Dispatches the request for metadata
   * @param {Array} pids
   */
  requestMetadata(pids) {
    if (pids.length) {
      this.props.getWorksAction(pids);
    }
  }

  render() {
    const reviewsList = this.renderReviewRows();

    return (
      <div className="reviews-container-component" >
        {reviewsList.splice(0, this.state.limit)}
      </div>
    );
  }
}

ReviewsContainer.displayName = 'ReviewsContainer';
ReviewsContainer.propTypes = {
  reviews: React.PropTypes.array.isRequired,
  user: React.PropTypes.object.isRequired,
  getWorksAction: React.PropTypes.func.isRequired,
  worksMetadata: React.PropTypes.object.isRequired
};
