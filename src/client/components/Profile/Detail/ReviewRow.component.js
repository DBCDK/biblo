/**
 * Renders a row containing a review to be displayed on the profile page
 */

import React from 'react';

// Components
import Rating from '../../General/Rating/Rating.component';

// SASS
import './scss/ReviewRow.component.scss';

export default class ReviewRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const review = this.props.review;
    const user = this.props.user;

    return (
      <div className="review--container" >
        <div className="review--header" >
          <div className="review--material--cover" >
            <img src={user.image.small} alt={user.displayName} />
          </div>
          <div className="review--data" >
            <img className="review--data--profilepic" src={user.image.small} alt={user.displayName} />
            <span className="review--data--username" >{user.displayName}</span>
            <span className="review--data--material-title" >Dette er en title - en meget meget meget meget meget ok lang titel</span>
            <Rating rating={review.rating} starsOnly={true} />
          </div>
        </div>

        <div className="review--content" >
          <span className="review--content--content" >{review.content}</span>
        </div>
      </div>
    );
  }
}

ReviewRow.propTypes = {
  review: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};
