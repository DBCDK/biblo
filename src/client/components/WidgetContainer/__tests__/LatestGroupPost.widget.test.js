/**
 * @file: This file contains tests for the Latest Group Posts widget.
 **/

// import libs
import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';

// import mocks
import {singleGroupPostMock} from '../__mocks__/GroupPost.mock';

describe('Test LatestGroupPosts Widget', () => {
  it('Test LatestGroupPosts widget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithTeaspoon({
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

    const LatestReviewsWidget = $root.find('h2').text();
    expect(LatestReviewsWidget).toEqual('LatestGroupPostsWidget displayTitle Test!');
  });

  it('Should render a post when given a group with a post.', () => {
    const $root = renderWidgetWithTeaspoon({
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

    const groupPostContent = $root.find('.compact-group-post-element--text-post').unwrap().innerHTML;
    expect(groupPostContent).toContain(singleGroupPostMock.html);
  });
});
