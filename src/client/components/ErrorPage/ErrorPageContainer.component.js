import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../Layout/PageLayout.component.js';
import * as searchActions from '../../Actions/search.actions';
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
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profileState} globalState={this.props.globalState} >
        <div className='error-page--error-splash'>
          <h1>UPS...</h1>
          <p>Du har ramt en side der ikke findes. Gå tilbage til den foregående side eller brug menuen til at komme
            videre.</p>
          <p>{statusCode} {messages[statusCode]}</p>
        </div>
      </PageLayout>
    );
  }
}

ErrorPageContainer.displayName = 'ErrorPageContainer';
ErrorPageContainer.propTypes = {
  profileState: React.PropTypes.object.isRequired,
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  globalState: React.PropTypes.object.isRequired
};

export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profileState: state.profileReducer,
      searchState: state.searchReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch)
    };
  }
)(ErrorPageContainer);
