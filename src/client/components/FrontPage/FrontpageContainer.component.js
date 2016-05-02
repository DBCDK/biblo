import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import parseJsonData from '../../Utils/parseJsonData.js';

import * as searchActions from '../../Actions/search.actions';

import PageLayout from '../Layout/PageLayout.component.js';
import ColoredHeader from '../General/ColoredHeader/ColoredHeader.component.js';
import ContentGrid from '../General/ContentGrid/ContentGrid.component.js';

import './_frontpage.scss';

const content = parseJsonData('JSONDATA', 'frontpageData');

export default class FrontpageContainer extends React.Component {
  render() {
    const welcomeText = content.welcome_text;

    const elements = content.elements;

    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions}>
        <ColoredHeader text={welcomeText} title={content.welcome_header}/>
        <ContentGrid items={elements}/>
      </PageLayout>
    );
  }
}

FrontpageContainer.displayName = 'ErrorPageContainer';
FrontpageContainer.propTypes = {
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired
};

export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      searchState: state.searchReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      searchActions: bindActionCreators(searchActions, dispatch)
    };
  }
)(FrontpageContainer);

