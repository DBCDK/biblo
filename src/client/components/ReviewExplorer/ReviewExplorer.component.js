import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TimeToString from '../../Utils/timeToString.js';

import parseJsonData from '../../Utils/parseJsonData.js';

import PageLayout from '../Layout/PageLayout.component.js';

import ReviewExplorerItem from './ReviewExplorerItem.js';
import ReviewExplorerNavigation from './ReviewExplorerNavigation.js';

import * as searchActions from '../../Actions/search.actions';
import * as widgetActions from '../../Actions/widget.actions';
import * as reviewActions from '../../Actions/review.actions';

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
          title={entry.work.dcTitle}
          content={entry.review.html}
          coverUrl={entry.work.coverUrlThumbnail ? entry.work.coverUrlThumbnail[0] : entry.work.coverUrl}
          rating={entry.review.rating}
          campaign={entry.review.campaign}
          likes={entry.review.likes}
          profile={this.props.profileState}
          created={TimeToString(entry.review.created)}/>
      );
    });
  }

  render() {
    const reviews = this.props.reviewState.reviewExplorer.reviews;
    const genres = this.props.reviewState.reviewExplorer.genres;

    return (
      <PageLayout
        searchState={this.props.searchState}
        searchActions={this.props.searchActions}
        profileState={this.props.profileState}
        globalState={this.props.globalState}>
          <ReviewExplorerNavigation genres={genres} onChange={this.handleNavigationChange.bind(this)}/>
          <h1>ANMELDELSER</h1>
          <hr/>
          {reviews && this.renderItems(reviews)}

      </PageLayout>
    );
  }


}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profileState: state.profileReducer,
      searchState: state.searchReducer,
      widgetState: state.widgetReducer,
      globalState: state.globalReducer,
      reviewState: state.reviewReducer,
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      widgetActions: bindActionCreators(widgetActions, dispatch),
      reviewActions: bindActionCreators(reviewActions, dispatch)
    };
  }
)(ReviewExplorerComponent);
