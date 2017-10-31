import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TimeToString from '../../Utils/timeToString.js';

import PageLayout from '../Layout/PageLayout.component.js';
import ReviewExplorerItem from './ReviewExplorerItem.js';
import ReviewExplorerNavigation from './ReviewExplorerNavigation.js';
import Icon from '../General/Icon/Icon.component.js';
import spinnerSvg from '../General/Icon/svg/spinners/loading-spin.svg';

import * as searchActions from '../../Actions/search.actions';
import * as widgetActions from '../../Actions/widget.actions';
import * as reviewActions from '../../Actions/review.actions';
import * as likeActions from '../../Actions/like.actions';
import * as uiActions from '../../Actions/ui.actions';

import './scss/ReviewExplorer.component.scss';

export class ReviewExplorerComponent extends Component {

  componentDidMount() {
    this.props.reviewActions.showGenres();
  }

  handleNavigationChange(e) {
    this.props.reviewActions.showReviewList(e, 0, 10);
  }

  renderItems(reviews) {
    return reviews.map((entry, idx) => {
      return (
        <ReviewExplorerItem key={idx}
          reviewId={entry.review.id}
          title={entry.work.dcTitle}
          content={entry.review.html}
          coverUrl={entry.work.coverUrlThumbnail ? entry.work.coverUrlThumbnail[0] : entry.work.coverUrl}
          rating={entry.review.rating}
          campaign={entry.review.campaign}
          likes={entry.review.likes}
          profile={this.props.profileState}
          created={TimeToString(entry.review.created)}
          owner={entry.review.owner}
          likeActions={this.props.likeActions}
          uiActions={this.props.uiActions}
          image={entry.review.image}
          video={entry.review.video}/>
      );
    });
  }

  render() {
    const {isLoading, reviews, genres} = this.props.reviewState.reviewExplorer;

    return (
      <PageLayout
        searchState={this.props.searchState}
        searchActions={this.props.searchActions}
        profileState={this.props.profileState}
        globalState={this.props.globalState}>
          <ReviewExplorerNavigation genres={genres} onChange={this.handleNavigationChange.bind(this)}/>
          <h1>ANMELDELSER</h1>
          <hr/>
          <div className="review-explorer--spinner">
            {isLoading && <Icon glyph={spinnerSvg} height={50} width={50}/>}
          </div>
          {reviews && this.renderItems(reviews)}

      </PageLayout>
    );
  }
}

ReviewExplorerComponent.displayName = 'ReviewExplorerComponent';
ReviewExplorerComponent.propTypes = {
  searchActions: PropTypes.object.isRequired,
  widgetActions: PropTypes.object.isRequired,
  reviewActions: PropTypes.object.isRequired,
  likeActions: PropTypes.object.isRequired,
  uiActions: PropTypes.object.isRequired,
  profileState: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  widgetState: PropTypes.object.isRequired,
  globalState: PropTypes.object.isRequired,
  reviewState: PropTypes.object.isRequired
};

export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profileState: state.profileReducer,
      searchState: state.searchReducer,
      widgetState: state.widgetReducer,
      globalState: state.globalReducer,
      reviewState: state.reviewReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      widgetActions: bindActionCreators(widgetActions, dispatch),
      reviewActions: bindActionCreators(reviewActions, dispatch),
      likeActions: bindActionCreators(likeActions, dispatch),
      uiActions: bindActionCreators(uiActions, dispatch)
    };
  }
)(ReviewExplorerComponent);
