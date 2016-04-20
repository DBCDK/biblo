import React from 'react';
import ReviewView from './ReviewView.component.js';

export default function ReviewList({reviews = [], profile = {},
   uiActions = null, reviewActions = null, flagActions = null, likeActions = null}) {
  return (
    <div className='review-list' >
      {
        reviews
        && reviews.map((item) => (<ReviewView
          key={item.id} {...item}
          profile={profile}
          likes={item.likes}
          uiActions={uiActions}
          reviewActions={reviewActions}
          flagActions={flagActions}
          likeActions={likeActions}
          uiActions={uiActions}
        />))
        || 'Der er ikke skrevet nogen anmeldelser'
      }
    </div>);
}

ReviewList.propTypes = {
  reviews: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired,
  reviewActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired
};
