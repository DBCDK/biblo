/**
 * Renders a row containing a review to be displayed on the profile page
 */

import React from 'react';

// Components
import Rating from '../../General/Rating/Rating.component';
import SimpleButton from '../../General/SimpleButton/SimpleButton.component';
import LikeButton from '../../General/LikeButton/LikeButton.component';

// SASS
import './scss/ReviewRow.component.scss';

export default class ReviewRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      likes: this.props.review.likes || []
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.metadata !== nextProps.metadata ||
      this.state.likes.toString() !== nextState.likes.toString()
    );
  }

  onClick() {
    if (typeof window !== 'undefined') {
      window.location = `/anmeldelse/${this.props.review.id}`;
    }
  }

  getTitle() {
    let title = 'Henter data';
    if (this.props.metadata.dcTitle) {
      title = this.props.metadata.dcTitle;
    }
    else if (this.props.metadata.dcFullTitle) {
      title = this.props.metadata.dcFullTitle;
    }

    return title;
  }

  getCoverUrl() {
    let coverUrl = '/images/covers/other.png';
    if (this.props.metadata.coverUrl) {
      coverUrl = this.props.metadata.coverUrl;
    }
    else if (this.props.metadata.workType) {
      coverUrl = `/images/covers/${this.props.metadata.workType}.png`;
    }
    return coverUrl;
  }

  likeReview() {
    const like = {
      profileId: this.props.activeUser.id,
      reviewId: this.props.review.id
    };

    this.props.likeActions.likeReview(like);

    const likes = this.state.likes.slice(); // treating state as immutable to make shouldComponentUpdate work proberly
    likes.push(like.profileId);

    this.setState({likes: likes});
  }

  unlikeReview() {
    const like = {
      profileId: this.props.activeUser.id,
      reviewId: this.props.review.id
    };

    this.props.likeActions.unlikeReview(like);
    const likes = this.state.likes.filter((id) => {
      return (id !== like.profileId);
    });

    this.setState({likes: likes});
  }

  render() {
    const activeUser = this.props.activeUser;
    const coverUrl = this.getCoverUrl();
    const title = this.getTitle();
    const review = this.props.review;
    const likes = this.state.likes;

    let content = review.content ? review.content : '';
    if (content.length > 200) {
      content = content.slice(0, 200) + '...';
    }

    const isLikedByActiveUser = likes.includes(activeUser.id);

    return (
      <div className="review--container" >
        <div className="review--header" >
          <div className="review--material--cover" >
            <img src={coverUrl} alt={title} />
          </div>
          <div className="review--data" >
            <span className="review--data--material-title" ><a href={`/materiale/${review.pid}`} >{title}</a></span>
            <div className="ratings" >
              <Rating rating={review.rating} />
            </div>
          </div>
        </div>

        <div className="review--content--container" >
          <div className="review--content" >{content}</div>
          <div className="review--content--actions" >
            <div className="review--content--actions--likebutton" >
              <LikeButton
                active={true}
                isLikedByCurrentUser={isLikedByActiveUser}
                likeFunction={this.likeReview.bind(this)}
                unlikeFunction={this.unlikeReview.bind(this)}
                usersWhoLikeThis={likes}
              />
            </div>
            <SimpleButton text={'Se hele anmeldelsen'} onClick={this.onClick.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

ReviewRow.displayName = 'ReviewRow';

ReviewRow.propTypes = {
  activeUser: React.PropTypes.object.isRequired,
  metadata: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  review: React.PropTypes.object.isRequired
};
