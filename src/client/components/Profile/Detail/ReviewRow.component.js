/**
 * Renders a row containing a review to be displayed on the profile page
 */

import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from './../../../Utils/sanitizeHtml.util';
import Truncate from '../../General/Truncate/Truncate.component';

// Components
import Rating from '../../General/Rating/Rating.component';
import SimpleButton from '../../General/SimpleButton/SimpleButton.component';
import LikeButton from '../../General/LikeButton/LikeButton.component';
import Icon from '../../General/Icon/Icon.component';

// SASS
import './scss/ReviewRow.component.scss';

export default class ReviewRow extends React.Component {
  static propTypes = {
    activeUser: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    likeActions: PropTypes.object.isRequired,
    review: PropTypes.object.isRequired
  };

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

  /**
   * Returns a rendered video link
   *
   * @param video {Object}
   * @param pid {string}
   * @param content {string}
   * @return {XML}
   */
  getVideoContainer(video, pid, content) {
    const resolution = video.resolutions.slice(-1)[0];
    const pureFileName = resolution.video.name.substring(0, resolution.video.name.lastIndexOf('.'));
    const videoImageSrc = `https://s3-eu-west-1.amazonaws.com/uxdev-biblo-video-thumbnails/${pureFileName}_thumb_00001.png`;

    return (
      <div className="review--content--videoplayer">
        <a title={content} href={`/materiale/${pid}`} className="compact-review--video--container">
          <img src={videoImageSrc} />
        </a>
      </div>
    );
  }

  render() {
    const activeUser = this.props.activeUser;
    const coverUrl = this.getCoverUrl();
    const title = this.getTitle();
    const review = this.props.review;
    const likes = this.state.likes;
    let content = review.content ? review.content : '';
    if (content.length > 200) {
      content = content.slice(0, 197) + '...';
    }
    const video = review.video ? this.getVideoContainer(review.video, review.pid, content) : null;
    content = content.split(/\r+\n/).join('<br />');
    const sanitizedContent = sanitizeHtml(content);

    const isLikedByActiveUser = likes.includes(activeUser.id);

    return (
      <div className="review--container">
        <div className="review--header">
          <div className="review--material--cover">
            <img src={coverUrl} alt={title} />
          </div>
          <div className="review--data">
            <span className="review--data--material-title">
              <a href={`/materiale/${review.pid}`}>
                <Truncate lines={5} ellipsis={<span>...</span>} text={title}/>
              </a>
            </span>
            <div className="ratings">
              <Rating rating={review.rating} />
            </div>
          </div>
        </div>

        <div className="review--content--container">
          {video &&
          <div className="review--content">{video}</div>
          ||
          <div className="review--content" dangerouslySetInnerHTML={{__html: sanitizedContent}} /> // eslint-disable-line
            // react/no-danger
          }
          <div className="review--content--actions">
            <SimpleButton text={'Se hele anmeldelsen'} onClick={this.onClick.bind(this)} />
            <div className="review--content--actions--likebutton">
              <LikeButton
                active={true}
                isLikedByCurrentUser={isLikedByActiveUser}
                likeFunction={this.likeReview.bind(this)}
                unlikeFunction={this.unlikeReview.bind(this)}
                usersWhoLikeThis={likes}
              />
            </div>
          </div>
        </div>
        {review.campaign && review.campaign.logos &&
        <div className="review--content--campaign">
          <Icon svgLink={review.campaign.logos.svg || review.campaign.logos.small} width={42} height={42} />
        </div>
        }
      </div>
    );
  }
}
