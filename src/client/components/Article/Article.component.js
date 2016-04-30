/* eslint-disable react/no-danger */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../Layout/PageLayout.component.js';
import parseJsonData from '../../Utils/parseJsonData.js';
import * as searchActions from '../../Actions/search.actions';

import './article.scss';

const articleData = parseJsonData('JSONDATA', 'articleData');

export class Article extends React.Component {
  render() {
    return (
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions}>
        <div className='article'>
          <div className='article-header'>
            <img src={articleData.headerImageUrl}/>
          </div>
          <div className='article-main' dangerouslySetInnerHTML={{__html: articleData.mainContent}}></div>
          <div className='article-factbox' dangerouslySetInnerHTML={{__html: articleData.factboxContent}}></div>
        </div>
      </PageLayout>
    );
  }
}

Article.displayName = 'Article';
Article.propTypes = {
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
)(Article);
