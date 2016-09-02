/* eslint-disable react/no-danger */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import parseJsonData from '../../Utils/parseJsonData.js';

import PageLayout from '../Layout/PageLayout.component.js';
import WidgetContainer from '../WidgetContainer/WidgetContainer.component';

import * as searchActions from '../../Actions/search.actions';
import * as widgetActions from '../../Actions/widget.actions';

import './article.scss';

const articleData = parseJsonData('JSONDATA', 'articleData');

export class Article extends React.Component {
  renderBibloAdminContentPage() {
    return (
      <div className="article">
        <div className='article-main'>
          <WidgetContainer
            widgetLocationName="ContentPageLeft"
            widgetState={this.props.widgetState}
            widgetActions={this.props.widgetActions}/>
        </div>
        <div className='article-factbox'>
          <WidgetContainer
            widgetLocationName="ContentPageFactBox"
            widgetState={this.props.widgetState}
            widgetActions={this.props.widgetActions}/>
        </div>

        <WidgetContainer
          widgetLocationName="SectionPage"
          widgetState={this.props.widgetState}
          widgetActions={this.props.widgetActions}/>
      </div>
    );
  }

  renderAmazonArticle() {
    return (
      <div className='article'>
        <div className='article-header'>
          <img src={articleData.headerImageUrl}/>
        </div>
        <div className='article-main' dangerouslySetInnerHTML={{__html: articleData.mainContent}}></div>
        <div className='article-factbox' dangerouslySetInnerHTML={{__html: articleData.factboxContent}}></div>
      </div>
    );
  }

  render() {
    let content;

    if (Object.getOwnPropertyNames(articleData).length > 0) {
      content = this.renderAmazonArticle();
    }
    else {
      content = this.renderBibloAdminContentPage();
    }

    return (
      <PageLayout
        searchState={this.props.searchState}
        searchActions={this.props.searchActions}
        profileState={this.props.profileState}
        globalState={this.props.globalState}>
        {content}
      </PageLayout>
    );
  }
}

Article.displayName = 'Article';
Article.propTypes = {
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
)(Article);
