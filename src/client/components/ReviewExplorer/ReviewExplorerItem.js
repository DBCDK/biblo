import React from 'react';
import PropTypes from 'prop-types';

import Rating from '../General/Rating/Rating.component';

import './scss/ReviewExplorerItem.scss';

export default class ReviewExplorerItem extends React.Component {



  render() {
    return (
      <div className="review-row--container">
        <div className="work--container">
          <div className="work-cover--container">
            <img
              className="review-row--cover-image"
              src={this.props.coverUrl}/>
          </div>
          <div className="work-description--container">
            <h4>{this.props.title}</h4>
            <p>2 dage siden</p>
          </div>
          <div className="campaign--container">
            <img
              className="review-row--campaign-image"
              src="/sommerbogen-logo.png"/>
          </div>
        </div>
        <div className="review--container">
          <div className="review-text--container">{this.props.content}</div>
          <div className="review-rating--container">
            <Rating rating={this.props.rating} pid={"review.pid"}/>
          </div>          
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
  campaign: PropTypes.object
};
