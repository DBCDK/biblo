/**
 * @file: Create a simple list of reviews. Initially written for the review list for the work page.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Review from './Review.component.js';
import ExpandButton from '../General/ExpandButton/ExpandButton.component';
import './ReviewList.scss';

export default function ReviewList({totalCount, reviews = [], profile = {}, uiActions = null,
  reviewActions = null, flagActions = null,
  likeActions = null, expand, delta = 15, pids = [], skip = 0, limit = 100000, isLoading, ownReview}) {

  let hasMore = false;
  if (totalCount > reviews.length) {
    hasMore = true;
  }

  let expandButton;
  if (hasMore && expand) {
    expandButton = (
      <ExpandButton className="reviews-showmore" text="VIS FLERE"
                    isLoading={isLoading}
                    onClick={()=> expand(pids, skip, parseInt(limit, 10) + parseInt(delta, 10))}/>
    );
  }

  let reviewsCountText;
  if (totalCount === 1) {
    reviewsCountText = (<div className='reviewsCount'>1 anmeldelse</div>);
  }
  if (totalCount > 1) {
    reviewsCountText = (<div className='reviewsCount'>{totalCount} anmeldelser</div>);
  }

  return (
    <div className='review-list'>
      <h2>{reviewsCountText}</h2>
      {
        reviews
        && reviews.map((item) => (<Review
          key={item.id} {...item}
          profile={profile}
          likes={item.likes}
          uiActions={uiActions}
          reviewActions={reviewActions}
          flagActions={flagActions}
          likeActions={likeActions}
          pids={pids}
          ownReview={ownReview}
        />))
        || 'Der er ikke skrevet nogen anmeldelser'
      }

      <div className="reviews--showmore-container">
        {expandButton}
      </div>
    </div>);
}

ReviewList.propTypes = {
  totalCount: PropTypes.number,
  reviews: PropTypes.array.isRequired,
  profile: PropTypes.object.isRequired,
  reviewActions: PropTypes.object.isRequired,
  flagActions: PropTypes.object.isRequired,
  likeActions: PropTypes.object.isRequired,
  uiActions: PropTypes.object.isRequired,
  expand: PropTypes.func,
  delta: PropTypes.number,
  skip: PropTypes.number,
  limit: PropTypes.number,
  pids: PropTypes.array,
  isLoading: PropTypes.bool,
  ownReview: PropTypes.bool
};

ReviewList.defaultProps = {
  ownReview: false
};
