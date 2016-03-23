'use strict';

import React from 'react';
import PageLayout from '../Layout/PageLayout.component.js';
import parseJsonData from '../../Utils/parseJsonData.js';

import './article.scss';

const articleData = parseJsonData('JSONDATA', 'articleData');

export default class Article extends React.Component {
  render() {
    return (
      <PageLayout>
        <div className='article'>
          <div className='article-header'>
            <img src={articleData.headerImageUrl}/>
          </div>
          <div className='article-main' dangerouslySetInnerHTML={{__html:articleData.mainContent}}></div>
          <div className='article-factbox' dangerouslySetInnerHTML={{__html:articleData.factboxContent}}></div>
        </div>
      </PageLayout>
    );
  }
}

Article.displayName = 'Article';
