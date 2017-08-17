import React from 'react';
import PropTypes from 'prop-types';

import Rating from '../General/Rating/Rating.component';
import LikeButton from '../General/LikeButton/LikeButton.component';

import RoundedButton from '../General/RoundedButton/RoundedButton.a.component';

import './scss/ReviewExplorerItem.scss';

export default class ReviewExplorerItem extends React.Component {

  /**
   * Returns a rendered video link
   *
   * @param video {Object}
   * @param pid {string}
   * @param content {string}
   * @return {XML}
   */
  getVideoContainer(video) {
    const resolution = video.resolutions.slice(-1)[0];
    const pureFileName = resolution.video.name.substring(0, resolution.video.name.lastIndexOf('.'));
    const videoImageSrc = `https://s3-eu-west-1.amazonaws.com/uxdev-biblo-video-thumbnails/${pureFileName}_thumb_00001.png`;

    return (
      <div className="review-row-desktop--review-video">
        <img src={videoImageSrc}/>
      </div>
    );
  }

  spawnLoginDialog() {
    const dialog = (
      <div>
        <p>Du skal logge ind for at like</p>
        <RoundedButton
          href={`/login?destination=${encodeURIComponent(window.location)}`}
          buttonText="Login"
          compact={false}
        />
      </div>
    );

    this.props.uiActions.openModalWindow(dialog);
  }

  unlikeReview() {
    this.props.likeActions.unlikeReview({
      reviewId: this.props.reviewId,
      profileId: this.props.profile.id
    });
  }

  likeReview() {
    this.props.likeActions.likeReview({
      reviewId: this.props.reviewId,
      profileId: this.props.profile.id
    });
  }

  render() {
    // console.log("profile", this.props.profile)
    const profile = this.props.profile;
    const logo = (this.props.campaign && this.props.campaign.logos) ? this.props.campaign.logos.small : null;
    const ownerimage = this.props.owner.image.url ? this.props.owner.image.url.medium : this.props.owner.image;
    const likeFunction = (profile.userIsLoggedIn) ? this.likeReview : this.spawnLoginDialog;
    const unlikeFunction = (this.props.profile.userIsLoggedIn) ? this.unlikeReview : () => {};
// console.log(this.props.owner)
    const likes = this.props.likes || [];
    return (
      <div className="review-row">
          <img
            className="review-row--cover-image"
            src={this.props.coverUrl}/>

          <div className="review-row--work-title">
            <h4>{this.props.title}</h4>
            <p>{this.props.created}</p>
            {this.props.image && <div className="review-row-mobile--review-image"><img src={this.props.image}/></div>}
          </div>

          <div className='review-row-mobile--campaign-image'>
            {logo ? <img src={logo}/> : <div>&nbsp;</div>}
          </div>

          <div className="review-row-desktop--owner-image">
            <a href={'/profil/'+this.props.owner.id}>
              <img src={ownerimage}/>
            </a>
          </div>

          <div className="review-row--review-text">
          {this.props.video && this.props.video.resolutions && this.props.video.resolutions.length ?
            this.getVideoContainer(this.props.video) : null}
            {this.props.image && <div className="review-row-desktop--review-image"><img src={this.props.image}/></div>}
            <div>{this.props.content}</div>
          </div>

          <div className="review-row-mobile--owner-image">
            <a href={'/profil/'+this.props.owner.id}>
              <img src={ownerimage}/>
            </a>
          </div>

          <div className="review-row-mobile--rating">
            <Rating rating={this.props.rating}/>
          </div>

          <div className='review-row-desktop--campaign-image'>
            {logo ? <img src={logo}/> : <div>&nbsp;</div>}
          </div>

          <div className="review-row--likebutton">
            <LikeButton
              active={this.props.profile.userIsLoggedIn}
              isLikedByCurrentUser={likes.includes(this.props.profile.id)}
              likeFunction={likeFunction.bind(this)}
              unlikeFunction={unlikeFunction.bind(this)}
              usersWhoLikeThis={likes}
              small={true}
            />
          </div>

      </div>
    );
  }

}

ReviewExplorerItem.propTypes = {
  reviewId: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  coverUrl: PropTypes.string,
  image: PropTypes.string,
  video: PropTypes.object,
  rating: PropTypes.number,
  campaign: PropTypes.object,
  likes: PropTypes.array,
  profile: PropTypes.object,
  created: PropTypes.string,
  owner: PropTypes.object,
  likeActions: PropTypes.object,
  uiActions: PropTypes.object
};
