import React from 'react';

import RoundedButtonSubmit from '../General/RoundedButton/RoundedButton.submit.component';
import Message from '../General/Message/Message.component.js';
import Rating from '../General/Rating/Rating.component';

// import Icon from '../General/Icon/Icon.component.js';
// import ContentAdd from '../Groups/AddContent/AddContent.component';

import './ReviewView.scss';

export default class ReviewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  upsert() {
    let review = {
      id: this.state.id,
      pid: this.state.pid,
      worktype: this.state.worktype,
      content: this.state.content,
      rating: this.state.rating
    };

    if (this.validate(review)) {
      if (review.id) {
        this.props.reviewActions.asyncUpdateReview(review);
      }
      else {
        this.props.reviewActions.asyncCreateReview(review);
      }
    }
  }

  validate() {
    let errors = [];
    if (this.state.rating <= 0) {
      errors.push(
        {
          field: 'rating',
          errorMessage: 'Du skal give stjerner'
        });
    }

    if (this.state.content === '') {
      errors.push({
        field: 'content',
        errorMessage: 'Du skal skrive en anmeldelse eller uploade en video-anmeldelse'
      });
    }

    if (errors.length <= 0) {
      return true;
    }
    this.setState({
      errors: errors
    });
    return false;
  }

  onRatingChange(val) {
    this.setState({
      rating: val
    });
  }

  onContentChange(e) {
    this.setState({content: e.target.value});
  }

  render() {
    const {
      errors,
      pid,
      content,
      rating
      } = this.state;

    const errorObj = {};
    if (errors) {
      errors.forEach((error) => {
        errorObj[error.field] = (
          <Message type='error'>
            <span className={error.field}> {error.errorMessage} </span>
          </Message>
        );
      });
    }

    return (
      <div className='review-wrapper'>
        <Rating ref="rating" pid={pid} rating={rating} onChange={this.onRatingChange.bind(this)}/>
        {errorObj.rating || ''}

        <div className={'review--content'}>
            <textarea
              ref="content"
              placeholder="Her kan du skrive din anmeldelse"
              name="review-content"
              required
              rows="5"
              value={content}
              onChange={this.onContentChange.bind(this)}
            />
          {errorObj.content || ''}
        </div>
        <RoundedButtonSubmit buttonText="OK" clickFunction={this.upsert.bind(this)}/>
      </div>
    );
  }
}

ReviewView.displayName = 'ReviewView';
ReviewView.propTypes = {
  profile: React.PropTypes.object.isRequired, // for editing, flagging, liking
  id: React.PropTypes.number,
  pid: React.PropTypes.string.isRequired,
  worktype: React.PropTypes.string.isRequired,
  content: React.PropTypes.string,
  rating: React.PropTypes.number,
  reviewActions: React.PropTypes.object.isRequired,
  // image: React.PropTypes.String,
  // video: React.PropTypes.object,
  // flagActions: React.PropTypes.object,
  // likes: React.PropTypes.array,
  // likeActions: React.PropTypes.object,
  errors: React.PropTypes.array
};
