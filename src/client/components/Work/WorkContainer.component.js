import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

<<<<<<< HEAD
import * as reviewActions from '../../Actions/review.actions';
import PageLayout from '../Layout/PageLayout.component';
import ReviewView from '../Review/ReviewView.component';
=======
import PageLayout from '../Layout/PageLayout.component.js';
import {WorkDetail} from './Detail/WorkDetail.component.js';
import {WorkHeader} from './Header/WorkHeader.component.js';
>>>>>>> 6b31f5fa78f299f1b87a64194315e488903b0e41

export class WorkContainer extends React.Component {
  render() {
    const jsonData = document.getElementById('JSONDATA');
    const data = JSON.parse(jsonData.innerHTML);
    const work = data.work; // eslint-disable-line no-unused-vars

    let profile = {
      id: 1
    };

    return (
      <PageLayout>
        <p>WorkContainer {work.id} {work.title}</p>
        <ReviewView
          profile={profile}
          pid={work.id}
          worktype="book"
          reviewActions={reviewActions}
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
