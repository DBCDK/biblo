import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import equal from 'deep-equal';

import PageLayout from '../Layout/PageLayout.component';
import Review from '../Review/Review.component';
import ReviewList from '../Review/ReviewList.js';
import Message from '../General/Message/Message.component.js';
import ModalWindow from '../General/ModalWindow/ModalWindow.component.js';

import {WorkDetail} from './Detail/WorkDetail.component.js';
import {WorkHeader} from './Header/WorkHeader.component.js';
import {MoreInfo} from './MoreInfo/MoreInfo.component.js';
import {MultiVolumeDisplay} from './MultiVolumeDisplay/MultiVolumeDisplay.component';
import {SeriesDisplay} from './SeriesDisplay/SeriesDisplay.component';

import * as reviewActions from '../../Actions/review.actions';
import * as flagActions from '../../Actions/flag.actions.js';
import * as likeActions from '../../Actions/like.actions.js';
import * as uiActions from '../../Actions/ui.actions.js';
import * as searchActions from '../../Actions/search.actions';
import * as workActions from '../../Actions/work.actions';
import * as EntitySuggestLibraryActions from '../../Actions/entitySuggetLibrary.actions';
import * as ProfileActions from '../../Actions/profile.actions';

import './WorkContainer.scss';

export class WorkContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewVisible: this.props.reviewState.workReviewsVisible || false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(this.state, nextState);
  }

  getProfile() {
    return this.props.profile;
  }

  getOwnReviewId() {
    return this.props.reviewState.workReviewsMeta.ownReviewId;
  }

  getEditText() {

    if (this.getOwnReviewId() && !this.state.reviewVisible) {
      return 'SE DIN ANMELDELSE';
    }
    return 'LAV EN ANMELDELSE';
  }

  toggleReview() {
    const profile = this.getProfile();
    if (profile.userIsLoggedIn) {
      if (!profile.quarantined) {
        if (this.getOwnReviewId()) {
          const reviewId = this.getOwnReviewId();
          window.location = '/anmeldelse/' + reviewId;
        }
        else {

          this.setState({
            reviewVisible: !this.state.reviewVisible
          });
        }
      }
      else {
        this.setState({
          reviewVisible: false,
          errorMessage: 'Du er i karantæne lige nu'
        });
      }
    }
    else {
      window.location = '/login?destination=' + encodeURIComponent(this.getCurrentLocation());
    }
  }

  getCurrentLocation() {
    return window.location.pathname + window.location.search;
  }

  librarySearch(e) {
    if (e && e.target && e.target.value) {
      this.props.libraryActions.asyncFindSuggestedLibraryAction(e.target.value);
    }
  }

  getMultiVolumeDisplay(work, multivolumeMetadata, getMetadataAction) {
    let multivolumeDisplay = null;
    if (work.multivolume && work.multivolume.length) {
      const multivolumeTitle = work.multivolume[0].title[0];
      multivolumeDisplay = (
        <MultiVolumeDisplay
          multivolume={work.multivolume}
          multivolumeTitle={multivolumeTitle}
          multivolumeMetadata={multivolumeMetadata}
          getMetadataAction={getMetadataAction}
        />
      );
    }
    return multivolumeDisplay;
  }

  render() {
    const work = this.props.workState.work; // the work collection from the service provider
    const isMultivolume = !!(work.multivolume && work.multivolume.length);
    const bind = (isMultivolume && /(bind \d+)/.exec((work.type[0] || '').toLowerCase())[0]) || '';
    const bindPids = isMultivolume && work.bind[work.bindId] ? work.bind[work.bindId].pid : work.collection;
    const bindDetails = isMultivolume ? work.bind[work.bindId] : {};
    const multivolumeDisplay = this.getMultiVolumeDisplay(
      work,
      this.props.workState.workMetadataOrderedByPid,
      this.props.workActions.asyncGetMultiVolumeDetailsFromPid
    );
    const reviews = this.props.reviewState.workReviews; // the reviews associated with the work
    const highlightedReview = this.props.reviewState.highlightedReview;
    const meta = this.props.reviewState.workReviewsMeta;
    const reviewVisible = this.state.reviewVisible; // is the review create area visible or not?
    const librarySuggestions = this.props.entitySuggest[this.props.entitySuggest.query].slice(0, 5).map(suggestion => {
      return {
        text: [suggestion.navn, suggestion.by].join(' i '),
        clickFunc: () => this.props.libraryActions.asyncSelectSuggestedLibrary(suggestion)
      };
    });

    let isOwnReview = false;
    if (reviews.length > 0) {
      isOwnReview = meta.ownReviewId === highlightedReview.id;
    }

    return (
      <PageLayout
        searchState={this.props.searchState}
        searchActions={this.props.searchActions}
        profileState={this.props.profile}
        globalState={this.props.globalState}
      >
        {this.props.ui.modal.isOpen && (
          <ModalWindow onClose={this.props.uiActions.closeModalWindow}>{this.props.ui.modal.children}</ModalWindow>
        )}
        <div className="work">
          <WorkHeader coverUrl={work.coverUrl} />
          <WorkDetail
            collection={work.collection}
            collectionDetails={work.collectionDetails}
            bindId={work.bindId}
            bindDetails={bindDetails}
            editText={this.getEditText()}
            reviewVisible={reviewVisible}
            toggleReview={this.toggleReview.bind(this)}
            title={work.dcTitle}
            displayType={work.workType}
            creator={work.creator}
            titleSeries={work.titleSeries}
            descriptionSeries={work.descriptionSeries}
            abstract={work.abstract}
            tags={work.tags}
            coverUrl={work.coverUrl}
            workType={work.workType}
            type={work.type[0]}
            isMultivolume={isMultivolume}
            bind={bind}
            fullTitle={work.dcTitleFull}
            orderState={this.props.workState.orderState}
            orderMaterialAction={this.props.workActions.asyncOrderWork}
            checkAvailabilityAction={this.props.workActions.asyncCheckAvailability}
            checkAvailabilityResult={this.props.workState.availability}
            checkAvailabilityDone={work.collection && this.props.workState.responses === work.collection.length}
            resetOrderState={this.props.workActions.resetOrderState}
            searchForLibraryAction={this.librarySearch.bind(this)}
            librarySearchResults={librarySuggestions}
            profile={this.props.profile}
            unselectLibraryFunction={this.props.libraryActions.unselectLibrary}
            saveProfileAction={this.props.profileActions.asyncProfileEditSubmit}
            getWorkOnlineAccessAction={this.props.workActions.asyncGetWorkOnlineAccess}
            ownReview={isOwnReview}
          />

          <div className="work--reviewlist">
            {reviewVisible && (
              <Review
                autoplayVideo={false}
                isEditing={true}
                toggleReview={this.toggleReview.bind(this)}
                profile={this.props.profile}
                owner={this.props.profile}
                pid={work.id}
                worktype={work.workType}
                reviewActions={this.props.reviewActions}
                uiActions={this.props.uiActions}
                flagActions={this.props.flagActions}
                likeActions={this.props.likeActions}
                pids={bindPids}
              />
            )}
            {this.state.errorMessage && (
              <Message type="error">
                <span> {this.state.errorMessage} </span>
              </Message>
            )}
            <ReviewList
              pids={bindPids}
              totalCount={meta.workReviewsTotalCount}
              limit={meta.limit}
              reviews={reviews}
              highlightedReview={highlightedReview}
              worktype={work.workType}
              profile={this.props.profile}
              reviewActions={this.props.reviewActions}
              uiActions={this.props.uiActions}
              flagActions={this.props.flagActions}
              likeActions={this.props.likeActions}
              expand={this.props.reviewActions.asyncShowWorkReviews}
            />
          </div>

          <div className="work--moreinfo">
            {multivolumeDisplay}

            {work.titleSeries.length > 0 && (
              <SeriesDisplay
                work={work}
                seriesResults={this.props.searchState.seriesResults}
                moreSeriesResults={this.props.searchState.moreSeriesResults}
                searchAction={this.props.searchActions.asyncQuerySeries}
              />
            )}

            <MoreInfo
              materials={work.collectionDetails}
              lix={work.lix}
              languages={work.dcLanguage}
              dk5={work.subjectDK5}
              dk5Text={work.subjectDK5Text}
              year={work.date}
              tags={work.tags}
              extent={work.extent}
              publisher={work.publisher}
              director={work.director}
              actors={work.actors}
              workType={work.workType}
              ageRecommended={work.ageRecommended}
              ageAllowed={work.ageAllowed}
              isMultivolume={isMultivolume}
              bind={bind}
            />
          </div>
        </div>
      </PageLayout>
    );
  }
}

WorkContainer.displayName = 'WorkContainer';
WorkContainer.propTypes = {
  searchState: PropTypes.object.isRequired,
  reviewState: PropTypes.object.isRequired,
  searchActions: PropTypes.object.isRequired,
  reviewActions: PropTypes.object.isRequired,
  flagActions: PropTypes.object.isRequired,
  likeActions: PropTypes.object.isRequired,
  uiActions: PropTypes.object.isRequired,
  ui: PropTypes.object,
  worktype: PropTypes.string,
  workActions: PropTypes.object.isRequired,
  workState: PropTypes.object.isRequired,
  profile: PropTypes.object,
  entitySuggest: PropTypes.object.isRequired,
  libraryActions: PropTypes.object.isRequired,
  profileActions: PropTypes.object.isRequired,
  globalState: PropTypes.object.isRequired
};

export default connect(
  state => {
    return {
      searchState: state.searchReducer,
      reviewState: state.reviewReducer,
      workState: state.workReducer,
      ui: state.uiReducer,
      profile: state.profileReducer,
      entitySuggest: state.entitySuggestReducer,
      globalState: state.globalReducer
    };
  },

  dispatch => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      workActions: bindActionCreators(workActions, dispatch),
      reviewActions: bindActionCreators(reviewActions, dispatch),
      flagActions: bindActionCreators(flagActions, dispatch),
      likeActions: bindActionCreators(likeActions, dispatch),
      uiActions: bindActionCreators(uiActions, dispatch),
      libraryActions: bindActionCreators(EntitySuggestLibraryActions, dispatch),
      profileActions: bindActionCreators(ProfileActions, dispatch)
    };
  }
)(WorkContainer);
