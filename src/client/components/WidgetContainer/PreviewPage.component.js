/* eslint-disable react/no-danger */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../Layout/PageLayout.component.js';
import WidgetContainer from '../WidgetContainer/WidgetContainer.component';

import * as searchActions from '../../Actions/search.actions';
import * as widgetActions from '../../Actions/widget.actions';

export class PreviewPage extends React.Component {
  render() {
    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profileState} globalState={this.props.globalState} >
      <WidgetContainer
          widgetLocationName="previewPage"
          widgetState={this.props.widgetState}
          widgetActions={this.props.widgetActions} />
      </PageLayout>
    );
  }
}

PreviewPage.displayName = 'PreviewPage';
PreviewPage.propTypes = {
  profileState: React.PropTypes.object.isRequired,
  widgetState: React.PropTypes.object.isRequired,
  widgetActions: React.PropTypes.object.isRequired,
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
      widgetState: state.widgetReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch),
      widgetActions: bindActionCreators(widgetActions, dispatch)
    };
  }
)(PreviewPage);
