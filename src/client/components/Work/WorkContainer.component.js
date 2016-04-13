import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as reviewActions from '../../Actions/review.actions';
import PageLayout from '../Layout/PageLayout.component';
import ReviewView from '../Review/ReviewView.component';

export class WorkContainer extends React.Component {
  render() {
    const jsonData = document.getElementById('JSONDATA');
    const data = JSON.parse(jsonData.innerHTML);
    const work = data.work;

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
