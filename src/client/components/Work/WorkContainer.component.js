import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as reviewActions from '../../Actions/review.actions';
import PageLayout from '../Layout/PageLayout.component';
import ReviewView from '../Review/ReviewView.component';
import ReviewList from '../Review/ReviewList.js';

import {WorkDetail} from './Detail/WorkDetail.component.js';
import {WorkHeader} from './Header/WorkHeader.component.js';

export class WorkContainer extends React.Component {

  render() {
    const jsonData = document.getElementById('JSONDATA');
    const data = JSON.parse(jsonData.innerHTML);
    const profile = data.profile;
    const work = data.work; // eslint-disable-line no-unused-vars

    return (
      <PageLayout>
        <p>WorkContainer {work.id} {work.title}</p>
        <WorkHeader coverUrl={'http://ecx.images-amazon.com/images/I/31Bnsm4xG4L._SX300_BO1,204,203,200_.jpg'} />
        <WorkDetail />

        <ReviewView
          profile={profile}
          pid={work.id}
          worktype="book"
          owner={profile}
          reviewActions={reviewActions}
        />

        <ReviewList
          reviews={data.reviews}
          reviewActions={reviewActions}
          worktype="book"
          profile={profile}
        />

      </PageLayout>
    );
  }
}

WorkContainer.displayName = 'WorkContainer';
WorkContainer.propTypes = {
  actions: React.PropTypes.object.isRequired,
  data: React.PropTypes.object
};

export default connect(
  (state) => {
    return {
      data: state.reviewReducer
    };
  },

  (dispatch) => {
    return {
      actions: bindActionCreators(reviewActions, dispatch)
    };
  }
)(WorkContainer);
