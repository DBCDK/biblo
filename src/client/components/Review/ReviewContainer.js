import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as reviewActions from '../../Actions/review.actions';
import * as searchActions from '../../Actions/search.actions';

import PageLayout from '../Layout/PageLayout.component.js';
import RoundedButton from '../General/RoundedButton/RoundedButton.a.component.js';
import ColoredHeader from '../General/ColoredHeader/ColoredHeader.component.js';
import ReviewView from './ReviewView.component.js';

export class ReviewContainer extends React.Component {
  render() {
    let {
      actions
      } = this.props;

    let profile = {
      id: 1
    };

    const text = 'her kan du skrive en anmeldelse ';
    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profileState}>
        <ColoredHeader text={text} title={'Anmeldelse'}/>
        <div className="reviewArea">
          <RoundedButton buttonText='Skriv en anmeldelse' href="#"/>
        </div>
        <ReviewView
          profile={profile}
          pid="testing"
          worktype="book"
          rating="4"
          reviewActions={actions}
        />
      </PageLayout>
    );
  }
}

ReviewContainer.displayName = 'ReviewContainer';
ReviewContainer.propTypes = {
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object,
  data: React.PropTypes.object
};

export default connect(
  (state) => {
    return {
      profileState: state.profileReducer,
      searchState: state.searchReducer,
      data: state.reviewReducer
    };
  },

  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      actions: bindActionCreators(reviewActions, dispatch)
    };
  }
)(ReviewContainer);
