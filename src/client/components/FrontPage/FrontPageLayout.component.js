'use strict';

/**
 * @file
 * Frontpage container compoennts rendering the MobilSøg frontapge
 */

import React from 'react';

// Components
import NewsList from '../News/NewsListContainer.component.js';
import RecommendationContainer from '../Recommend/RecommendationContainer.component.js';
import SearchFieldContainer from '../searchfield/SearchFieldContainer.component';
import Query from '../query/Query.component.js';

// Layouts
import FrontPageRecommendationsLayout from './layouts/FrontPageRecommendationsLayout.component';


export default class FrontPageLayoutMobilsoeg extends React.Component {
  render() {
    return (
      <div className="frontpage-container" >
        <div className="frontpage-container--content row" >
          <div className="frontpage-container--search--container large-16 columns" >
            <div className="frontpage-container--search--searchfield" >
              <Query queryLocation='/search' shouldDoPageLoad />
              <SearchFieldContainer />
            </div>
            <div className="frontpage-container--search--recommendations" >
              <RecommendationContainer layout={FrontPageRecommendationsLayout} recommendations={this.props.recommendations} />
            </div>
          </div>

          <div className="frontpage-container--news--container large-8 columns" >
            <div className="frontpage-container--news" >
              <NewsList loadNumberOfPosts="10" showNumberOfPosts="4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FrontPageLayoutMobilsoeg.displayName = 'FrontPageLayoutMobilsoeg';
FrontPageLayoutMobilsoeg.propTypes = {
  recommendations: React.PropTypes.array
};
