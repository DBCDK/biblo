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

import * as reviewActions from '../../Actions/review.actions';
import * as flagActions from '../../Actions/flag.actions.js';
import * as likeActions from '../../Actions/like.actions.js';
import * as uiActions from '../../Actions/ui.actions.js';

export class WorkContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      reviewVisible: false
    };
  }

  getData() {
    return this.props.reviews;
  }

  getProfile() {
    let profile = this.getData().profile;
    profile.image = profile.image && '/billede/' + profile.image.id + '/medium' || null;
    return profile;
  }

  toggleReview() {
    if (!this.getProfile().quarantined) {
      this.setState({
        reviewVisible: !this.state.reviewVisible
      });
    }
    else {
      this.setState({
        reviewVisible: false,
        errorMessage: 'Du er i karantæne lige nu'
      });
    }
  }

  render() {
    const data = this.getData();

    const coverUrl = 'http://ecx.images-amazon.com/images/I/31Bnsm4xG4L._SX300_BO1,204,203,200_.jpg';

    let profile = this.getProfile();
    return (
      <PageLayout>
         {this.props.ui.modal.isOpen &&
         <ModalWindow onClose={this.props.uiActions.closeModalWindow}>
          {
            this.props.ui.modal.children
          }
        </ModalWindow>
        }
        <WorkHeader coverUrl={'http://ecx.images-amazon.com/images/I/31Bnsm4xG4L._SX300_BO1,204,203,200_.jpg'}/>
        <WorkDetail
          toggleReview={this.toggleReview.bind(this)}
          title={data.work.dcTitle[0]}
          displayType={data.work.workType[0]}
          creator={data.work.creator[0]}
          abstract={data.work.abstract[0]}
          year={data.work.date[0]}
          tags={['emneord1', 'emneord2', 'emneord3']}
          coverUrl={coverUrl}
          />
        {
          this.state.reviewVisible &&
          <Review
            ref='review'
            isEditing={true}
            profile={profile}
            pid={data.work.id}
            worktype={this.props.worktype || 'book'}
            owner={profile}
            reviewActions={this.props.actions}
            uiActions={this.props.uiActions}
            flagActions={this.props.flagActions}
            likeActions={this.props.likeActions}
          />
        }
        {
          this.state.errorMessage &&
          <Message type='error'>
            <span> {this.state.errorMessage} </span>
          </Message>
        }

        <ReviewList
          reviews={data.reviews}
          worktype="book"
          profile={data.profile}
          reviewActions={this.props.actions}
          uiActions={this.props.uiActions}
          flagActions={this.props.flagActions}
          likeActions={this.props.likeActions}
        />

      </PageLayout>
    );
  }
}

WorkContainer.displayName = 'WorkContainer';
WorkContainer.propTypes = {
  actions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  reviews: React.PropTypes.object,
  ui: React.PropTypes.object,
  worktype: React.PropTypes.string
};

export default connect(
  (state) => {
    return {
      reviews: state.reviewReducer,
      ui: state.uiReducer
    };
  },

  (dispatch) => {
    return {
      actions: bindActionCreators(reviewActions, dispatch),
      flagActions: bindActionCreators(flagActions, dispatch),
      likeActions: bindActionCreators(likeActions, dispatch),
      uiActions: bindActionCreators(uiActions, dispatch)
    };
  }
)(WorkContainer);
