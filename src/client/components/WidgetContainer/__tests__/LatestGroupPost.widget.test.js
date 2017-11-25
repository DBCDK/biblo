/**
 * @file: This file contains tests for the Latest Group Posts widget.
 **/

// import libs
import {expect} from 'chai';
import {renderWidgetWithEnzyme} from './widgetTest.utils';

// import mocks
import {singleGroupPostMock} from '../__mocks__/GroupPost.mock';

describe('Test LatestGroupPosts Widget', () => {
  it('Test LatestGroupPosts widget can render inside a WidgetContainer', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-latest-group-posts-widget-location',
      widgetName: 'LatestGroupPostsWidget',
      widgetConfig: {
        displayTitle: 'LatestGroupPostsWidget displayTitle Test!',
        showTitle: true
      },
      state: {
        LatestGroupPostsWidget: {
          posts: {},
          groups: {},
          groupLoading: true,
          postsLoading: true,
          isLoading: true
        }
      }
    });

    const LatestReviewsWidget = wrapper.find('h2').first().text();
    expect(LatestReviewsWidget).to.equal('LatestGroupPostsWidget displayTitle Test!');
  });

  it('Should render a post when given a group with a post', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-latest-group-posts-widget-location',
      widgetName: 'LatestGroupPostsWidget',
      widgetConfig: {
        displayTitle: 'LatestGroupPostsWidget displayTitle Test!',
        showTitle: true,
        postsToLoad: 3,
        group: 136
      },
      state: {
        LatestGroupPostsWidget: {
          posts: {
            136: [singleGroupPostMock]
          },
          groups: {
            136: {}
          },
          groupLoading: false,
          postsLoading: false,
          isLoading: false
        }
      }
    });

    const groupPostContent = wrapper.find('.compact-group-post-element--container.text--post').first().text();
    expect(groupPostContent).to.include(singleGroupPostMock.html);
  });
});
