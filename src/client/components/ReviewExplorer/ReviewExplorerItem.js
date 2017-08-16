import React from 'react';
import PropTypes from 'prop-types';

import Rating from '../General/Rating/Rating.component';
import LikeButton from '../General/LikeButton/LikeButton.component';


import './scss/ReviewExplorerItem.scss';

export default class ReviewExplorerItem extends React.Component {

  render() {
    // console.log("profile", this.props.profile)
    const likes = this.props.likes || [];
    return (
      <div className="review-row">
          <img
            className="review-row--cover-image"
            src={this.props.coverUrl}/>

          <div className="review-row--work-title">
            <h4>{this.props.title}</h4>
            <p>2 dage siden</p>
          </div>

          <img
            className="review-row-mobile--campaign-image"
            src="/sommerbogen-logo.png"/>

          <div className="review-row-desktop--owner-image">
            <a href="/profil/44400">
              <img src="/billede/183/small"/>
            </a>
          </div>

          <div className="review-row--review-text">
            <div>{this.props.content}</div>
          </div>

          <div className="review-row-mobile--owner-image">
            <a href="/profil/44400">
              <img src="/billede/183/small"/>
            </a>
          </div>

          <div className="review-row-mobile--rating">
            <Rating rating={this.props.rating} pid={"review.pid"}/>
          </div>

          <img
            className="review-row-desktop--campaign-image"
            src="/sommerbogen-logo.png"/>

          <div className="review-row--likebutton">
            <LikeButton
              active={true}
              isLikedByCurrentUser={likes.includes(this.props.profile.id)}
              likeFunction={()=>{}}
              unlikeFunction={()=>{}}
              usersWhoLikeThis={likes}
              small={true}
            />
          </div>

      </div>
    );
  }

}

ReviewExplorerItem.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  coverUrl: PropTypes.string,
  rating: PropTypes.number,
  campaign: PropTypes.object,
  likes: PropTypes.array,
  profile: PropTypes.object
};
