/**
 * @file: This file contains tests for the Latest posts widget.
 **/

// import libs
import {expect} from 'chai';
import {renderWidgetWithEnzyme} from './widgetTest.utils';

import {singleGroupPostMock} from '../__mocks__/GroupPost.mock';

describe('Test LatestPosts Widget', () => {
  it('Test LatestPosts widget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithEnzyme({
      location: 'test-latest-posts-widget-location',
      widgetName: 'LatestPostsWidget',
      widgetConfig: {
        displayTitle: 'LatestPosts displayTitle Test!',
        showTitle: true
      },
      state: {
        LatestPostsWidget: {
          posts: [],
          postsLoading: true
        }
      }
    });

    const LatestPostsTitle = $root.find('h2').text();
    expect(LatestPostsTitle).to.equal('LatestPosts displayTitle Test!');
  });

  it('can render a single compact post element', () => {
    const $root = renderWidgetWithEnzyme({
      location: 'test-latest-posts-widget-location',
      widgetName: 'LatestPostsWidget',
      widgetConfig: {
        displayTitle: 'LatestPosts displayTitle Test!',
        showTitle: true
      },
      state: {
        LatestPostsWidget: {
          posts: [singleGroupPostMock],
          postsLoading: false
        }
      }
    });

    expect($root.find('.cgp--group-link').text()).to.equal(' Awesome mennesker:)');
  });
});
