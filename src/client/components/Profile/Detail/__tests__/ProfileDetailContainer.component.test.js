'use strict';

/**
 * @file: Tests for profile detail container (also known as public profile).
 */

// import libs
import React from 'react';
import expect from 'expect';
import $ from 'teaspoon';

// import components
import {ProfileDetailContainer} from '../ProfileDetailContainer.component';

// import mocks
import {profileMock} from '../../../__mocks__/profile.mock';
import {emptyFeedMock, feedMock} from '../../../__mocks__/feed.mock';
import {uiMock} from '../../../__mocks__/ui.mock';

describe('Test profile detail container (public profile)', () => {
  it('Test profile detail container can render', () => {
    const noop = () => {};

    // actions for this test (just use spies)
    let feedActions = {
      asyncGetUserFeed: noop,
      getUserFeed: noop
    };

    let uiActions = {
      openModalWindow: noop,
      closeModalWindow: noop
    };

    let component = (
      <ProfileDetailContainer
        feed={emptyFeedMock}
        feedActions={feedActions}
        profile={profileMock}
        ui={uiMock}
        uiActions={uiActions}
      />
    );

    let $root = $(component).render();

    const emptyHeader = $root.find('.activity-row--title').text();
    expect(emptyHeader).toContain('Her er tomt!');

    const firstActivityRow = $root.find('.activity-row').first().dom().innerHTML;
    expect(firstActivityRow).toContain(profileMock.displayName);
    expect(firstActivityRow).toContain('har ikke lavet noget...');
  });

  it('should render activity rows containing posts, and a comment.', () => {
    const noop = () => {};

    // actions for this test (just use spies)
    let feedActions = {
      asyncGetUserFeed: noop,
      getUserFeed: noop
    };

    let uiActions = {
      openModalWindow: noop,
      closeModalWindow: noop
    };

    let component = (
      <ProfileDetailContainer
        feed={feedMock}
        feedActions={feedActions}
        profile={profileMock}
        ui={uiMock}
        uiActions={uiActions}
      />
    );

    let $root = $(component).render();

    let activityRows = $root.find('.activity-row--container > .activity-row');

    expect(activityRows[0].innerHTML).toContain(`Se hvad ${profileMock.displayName} har lavet:`);
    expect(activityRows[1].innerHTML).toContain(feedMock.feed[0].content);
    expect(activityRows[2].innerHTML).toContain(feedMock.feed[1].content);
  });
});
