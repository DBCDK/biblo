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
    const jsonData = document.getElementById('JSONDATA');
    return JSON.parse(jsonData.innerHTML);
  }

  getProfile() {
    return this.getData().profile;
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
    return (
      <PageLayout>
         {this.props.ui.modal.isOpen &&
         <ModalWindow onClose={this.props.uiActions.closeModalWindow}>
          {
            this.props.ui.modal.children
          }
        </ModalWindow>
        }
        <p>WorkContainer {data.work.id} {data.work.title}</p>
        <WorkHeader coverUrl={'http://ecx.images-amazon.com/images/I/31Bnsm4xG4L._SX300_BO1,204,203,200_.jpg'}/>
        <WorkDetail toggleReview={this.toggleReview.bind(this)}/>
        {
          this.state.reviewVisible &&
          <Review
            ref='review'
            isEditing={true}
            profile={data.profile}
            pid={data.work.id}
            worktype="book"
            owner={data.profile}
            reviewActions={this.props.actions}
            uiActions={this.props.uiActions}
            flagActions={this.props.flagActions}
            likeActions={this.props.likeActions}
            uiActions={this.props.uiActions}
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
  data: React.PropTypes.object
};

export default connect(
  (state) => {
    return {
      data: state.reviewReducer,
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
