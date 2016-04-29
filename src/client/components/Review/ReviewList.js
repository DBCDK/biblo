import React from 'react';
import Review from './Review.component.js';
import ExpandButton from '../General/ExpandButton/ExpandButton.component';
import './ReviewList.scss';

export default function ReviewList({count, reviews = [], profile = {}, uiActions = null,
  reviewActions = null, flagActions = null,
  likeActions = null, expand, delta = 15, skip = 0, limit = 100000, isLoading}) {

  let hasMore = true;
  if (limit > reviews.length) {
    hasMore = false;
  }

  let expandButton;

  if (hasMore && expand) {
    expandButton = (
      <ExpandButton className="group-showmore" text="Vis flere"
                    isLoading={isLoading}
                    onClick={()=> expand(skip, parseInt(limit, 10) + parseInt(delta, 10))}/>
    );
  }

  let reviewsCountText;
  if (count === 1) {
    reviewsCountText = (<div className='reviewsCount'>1 anmeldelse</div>);
  }
  if (count > 1) {
    reviewsCountText = (<div className='reviewsCount'>{count} anmeldelser</div>);
  }

  return (
    <div className='review-list'>
      {reviewsCountText}
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
        />))
        || 'Der er ikke skrevet nogen anmeldelser'
      }

      <div className="reviews--showmore">
        {expandButton}
      </div>
    </div>);
}

ReviewList.propTypes = {
  count: React.PropTypes.number.isRequired,
  reviews: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired,
  reviewActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  expand: React.PropTypes.func.isRequired,
  delta: React.PropTypes.number,
  skip: React.PropTypes.number,
  limit: React.PropTypes.number,
  isLoading: React.PropTypes.bool
};