import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as searchActions from '../../Actions/search.actions';
import * as widgetActions from '../../Actions/widget.actions';

import PageLayout from '../Layout/PageLayout.component.js';
import WidgetContainer from '../WidgetContainer/WidgetContainer.component';

import './_frontpage.scss';

class FrontpageContainer extends React.Component {
  render() {
    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profileState} globalState={this.props.globalState} >
      <WidgetContainer
          widgetLocationName="FrontPageContent"
          widgetActions={this.props.widgetActions}
          widgetState={this.props.widgetState} />
      </PageLayout>
    );
  }
}

FrontpageContainer.displayName = 'FrontPageContent';
FrontpageContainer.propTypes = {
  profileState: React.PropTypes.object.isRequired,
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  widgetState: React.PropTypes.object.isRequired,
  widgetActions: React.PropTypes.object.isRequired,
  globalState: React.PropTypes.object.isRequired
};

export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profileState: state.profileReducer,
      widgetState: state.widgetReducer,
      searchState: state.searchReducer,
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
)(FrontpageContainer);

