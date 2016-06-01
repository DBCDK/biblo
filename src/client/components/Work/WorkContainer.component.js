import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../Layout/PageLayout.component';
import Review from '../Review/Review.component';
import ReviewList from '../Review/ReviewList.js';
import Message from '../General/Message/Message.component.js';
import ModalWindow from '../General/ModalWindow/ModalWindow.component.js';

import {WorkDetail} from './Detail/WorkDetail.component.js';
import {WorkHeader} from './Header/WorkHeader.component.js';
import {MoreInfo} from './MoreInfo/MoreInfo.component.js';

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
    let profile = this.getProfile();
    if (profile.userIsLoggedIn) {
      if (!profile.quarantined) {
        if (this.getOwnReviewId()) {
          let reviewId = this.getOwnReviewId();
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

  render() {
    const work = this.props.workState.work;               // the work collection from the service provider
    const reviews = this.props.reviewState.workReviews;   // the reviews associated with the work
    const meta = this.props.reviewState.workReviewsMeta;
    let reviewVisible = this.state.reviewVisible;         // is the review create area visible or not?

    const coverUrl = (work.coverUrlFull) ? 'http:' + work.coverUrlFull[0] : '/Billede-kommer-snart.jpg';
    const abstract = (work.abstract) ? work.abstract[0] : '';
    const creator = (work.creator) ? work.creator[0] : '';
    const workType = (work.workType) ? work.workType[0] : 'other';
    const extent = (work.extent) ? work.extent[0] : '';

    let tags = [];
    tags = (work.subjectDBCF) ? tags.concat(work.subjectDBCF) : tags;
    tags = (work.subjectDBCS) ? tags.concat(work.subjectDBCS) : tags;
    tags = (work.subjectDBCO) ? tags.concat(work.subjectDBCO) : tags;
    tags = (work.subjectDBCM) ? tags.concat(work.subjectDBCM) : tags;

    const subjectDK5 = (work.subjectDK5) ? work.subjectDK5[0] : '';
    const subjectDK5Text = (work.subjectDK5Text) ? work.subjectDK5Text[0] : '';
    const director = (work.creatorDrt) ? work.creatorDrt[0] : null;
    const actors = (work.contributorAct) ? work.contributorAct : null;
    const publisher = (work.publisher) ? work.publisher[0] : null;
    const ageRecommended = (work.audienceAge) ? work.audienceAge : null;
    const ageAllowed = (work.audienceMedieraad) ? work.audienceMedieraad[0] : null;

    let librarySuggestions = this.props.entitySuggest[this.props.entitySuggest.query].slice(0, 5).map((suggestion) => {
      return {
        text: [suggestion.navn, suggestion.by].join(' i '),
        clickFunc: () => this.props.libraryActions.asyncSelectSuggestedLibrary(suggestion)
      };
    });

    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions}>
        {this.props.ui.modal.isOpen &&
        <ModalWindow onClose={this.props.uiActions.closeModalWindow}>
          {
            this.props.ui.modal.children
          }
        </ModalWindow>
        }
        <div className='work'>
          <WorkHeader coverUrl={coverUrl}/>
          <WorkDetail
            collection={work.collection}
            collectionDetails={work.collectionDetails}
            editText={this.getEditText()}
            reviewVisible={reviewVisible}
            toggleReview={this.toggleReview.bind(this)}
            title={work.dcTitle[0]}
            displayType={workType}
            creator={creator}
            abstract={abstract}
            tags={tags}
            coverUrl={coverUrl}
            workType={workType}
            orderState={this.props.workState.orderState}
            orderMaterialAction={this.props.workActions.asyncOrderWork}
            checkOrderPolicyAction={this.props.workActions.asyncCheckOrderPolicy}
            checkOrderPolicyResult={this.props.workState.orderPolicy}
            checkOrderPolicyDone={work.collection && this.props.workState.responses === work.collection.length}
            searchForLibraryAction={this.librarySearch.bind(this)}
            librarySearchResults={librarySuggestions}
            profile={this.props.profile}
            unselectLibraryFunction={this.props.libraryActions.unselectLibrary}
            saveProfileAction={this.props.profileActions.asyncProfileEditSubmit}
            getWorkOnlineAccessAction={this.props.workActions.asyncGetWorkOnlineAccess}
          />
          {
            reviewVisible &&
            <Review
              ref='review'
              isEditing={true}
              toggleReview={this.toggleReview.bind(this)}
              profile={this.props.profile}
              owner={this.props.profile}
              pid={work.id}
              worktype={workType}
              reviewActions={this.props.reviewActions}
              uiActions={this.props.uiActions}
              flagActions={this.props.flagActions}
              likeActions={this.props.likeActions}
              pids={work.collection}
            />
          }
          {
            this.state.errorMessage &&
            <Message type='error'>
              <span> {this.state.errorMessage} </span>
            </Message>
          }

          <div className='work--reviewlist'>
            <ReviewList
              pids={work.collection}
              totalCount={meta.workReviewsTotalCount}
              limit={meta.limit}
              reviews={reviews}
              worktype={workType}
              profile={this.props.profile}
              reviewActions={this.props.reviewActions}
              uiActions={this.props.uiActions}
              flagActions={this.props.flagActions}
              likeActions={this.props.likeActions}
              expand={this.props.reviewActions.asyncShowWorkReviews}
            />
          </div>

          <div className="work--moreinfo">
            <MoreInfo
              materials={work.collectionDetails}
              lix={work.lix}
              languages={work.dcLanguage}
              dk5={subjectDK5}
              dk5Text={subjectDK5Text}
              year={work.date}
              tags={tags}
              extent={extent}
              publisher={publisher}
              director={director}
              actors={actors}
              workType={workType}
              ageRecommended={ageRecommended}
              ageAllowed={ageAllowed}
            />
          </div>
        </div>
      </PageLayout>
    );
  }
}

WorkContainer.displayName = 'WorkContainer';
WorkContainer.propTypes = {
  searchState: React.PropTypes.object.isRequired,
  reviewState: React.PropTypes.object.isRequied,
  searchActions: React.PropTypes.object.isRequired,
  reviewActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object,
  worktype: React.PropTypes.string,
  workActions: React.PropTypes.object.isRequired,
  workState: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object,
  entitySuggest: React.PropTypes.object.isRequired,
  libraryActions: React.PropTypes.object.isRequired,
  profileActions: React.PropTypes.object.isRequired
};

export default connect(
  (state) => {
    return {
      searchState: state.searchReducer,
      reviewState: state.reviewReducer,
      workState: state.workReducer,
      ui: state.uiReducer,
      profile: state.profileReducer,
      entitySuggest: state.entitySuggestReducer
    };
  },

  (dispatch) => {
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
