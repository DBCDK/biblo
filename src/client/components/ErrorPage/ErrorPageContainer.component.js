import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../Layout/PageLayout.component.js';
import * as searchActions from '../../Actions/search.actions';
import * as profileActions from '../../Actions/profile.actions';
import parseJsonData from '../../Utils/parseJsonData.js';

import './errorpage.scss';

const statusCode = parseJsonData('JSONDATA', 'statusCode');

export class ErrorPageContainer extends React.Component {
  render() {
    const messages = {
      404: 'Siden blev ikke fundet',
      500: 'Der er sket en fejl',
      403: 'Du har ikke adgang til denne side'
    };

    return (
      <PageLayout
        searchState={this.props.searchState}
        searchActions={this.props.searchActions}
        profileState={this.props.profileState}
        globalState={this.props.globalState}
        profileActions={this.props.profileActions}
      >
        <div className="error-page--error-splash">
          <h1>UPS...</h1>
          <p>
            Du har ramt en side der ikke findes. Gå tilbage til den foregående side eller brug menuen til at komme
            videre.
          </p>
          <p>
            {statusCode} {messages[statusCode]}
          </p>
        </div>
      </PageLayout>
    );
  }
}

ErrorPageContainer.displayName = 'ErrorPageContainer';
ErrorPageContainer.propTypes = {
  profileState: PropTypes.object.isRequired,
  profileActions: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  searchActions: PropTypes.object.isRequired,
  globalState: PropTypes.object.isRequired
};

export default connect(
  // Map redux state to group prop
  state => {
    return {
      profileState: state.profileReducer,
      searchState: state.searchReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  dispatch => {
    return {
      profileActions: bindActionCreators(profileActions, dispatch),
      searchActions: bindActionCreators(searchActions, dispatch)
    };
  }
)(ErrorPageContainer);
