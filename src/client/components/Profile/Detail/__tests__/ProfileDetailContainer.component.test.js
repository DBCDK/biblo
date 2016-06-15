/**
 * @file: Tests for profile detail container (also known as public profile).
 */

// import libs
import React from 'react';
import expect from 'expect';
import {assert} from 'chai';
import $ from 'teaspoon';
import sd from 'skin-deep';
import assignToEmpty from '../../../../Utils/assign';

// import components
import {ProfileDetailContainer} from '../ProfileDetailContainer.component';

// import mocks
import {profileMock, moderatorMock} from '../../../__mocks__/profile.mock';
import {emptyFeedMock, feedMock, moderatedFeedMock} from '../../../__mocks__/feed.mock';
import {uiMock} from '../../../__mocks__/ui.mock';
import {reviewsMock} from '../../../__mocks__/reviews.mock';

describe('Test profile detail container (public profile)', () => {
  const noop = () => {
  };

  // actions for this test (just use spies)
  const feedActions = {
    asyncGetUserFeed: noop,
    getUserFeed: noop
  };

  const uiActions = {
    openModalWindow: noop,
    closeModalWindow: noop
  };

  const reviews = {
    userReviews: []
  };

  const coverImageActions = {
    asyncListenForCoverImages: noop,
    asyncGetCoverImage: noop
  };

  const coverImages = {};

  const workActions = {
    asyncGetWorks: noop
  };

  const works = {
    workMetadataOrderedByPid: {}
  };

  const group = {};
  const groupActions = {};
  const flagActions = {};
  const likeActions = {};
  const searchActions = {};

  const searchState = {
    isSearchBoxVisible: false,
    groupSearchResults: [],
    groupSearchResultsPending: true,
    materialSearchResults: [],
    materialSearchResultsPending: true,
    workSuggestions: {},
    workSuggestionsPending: false,
    selectedWorkSuggestion: -1,
    initialQuery: '',
    query: '',
    isLoadingResults: false
  };

  it('should render activity rows containing posts, and a comment.', () => {
    const component = (
      <ProfileDetailContainer
        searchState={searchState}
        feed={feedMock}
        feedActions={feedActions}
        flagActions={flagActions}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={profileMock}
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        selectedTab={1}
        searchActions={searchActions}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        workActions={workActions}
        works={works}
      />
    );

    const $root = $(component).render();

    const activityRows = $root.find('.activity-row--container > .activity-row');

    expect(activityRows[0].innerHTML).toContain(feedMock.feed[0].html);
    expect(activityRows[1].outerHTML).toContain(feedMock.feed[1].html);
  });

  it('should render rows containing an edit link when a moderator is viewing', () => {
    const component = (
      <ProfileDetailContainer
        searchState={searchState}
        feed={moderatedFeedMock}
        feedActions={feedActions}
        flagActions={flagActions}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={moderatorMock}
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        selectedTab={1}
        searchActions={searchActions}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        workActions={workActions}
        works={works}
      />
    );

    const $root = $(component).render();
    const postEditButtons = $root.find('.edit-post--button');
    const commentEditButtons = $root.find('.edit-comment--button');

    expect(postEditButtons.length).toEqual(4); // two posts, and two comments with posts wrapped around.
    expect(commentEditButtons.length).toEqual(2); // two comments.
  });

  it('should render tabs', () => {
    const component = (
      <ProfileDetailContainer
        searchState={searchState}
        feed={feedMock}
        feedActions={feedActions}
        flagActions={flagActions}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={profileMock}
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        searchActions={searchActions}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        workActions={workActions}
        works={works}
      />
    );

    const $root = $(component).render();

    const tabs = $root.find('.p-detail--activity-tabs');
    expect(tabs[0].innerHTML).toContain('tabs-container');
  });

  it('Should render campaignDiplomaButtons', () => {
    const _reviews = assignToEmpty(reviews, {userReviews: reviewsMock});

    const tree = sd.shallowRender(
      <ProfileDetailContainer
        feed={feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={feedMock.profile} // the users we're looking at
        ui={uiMock}
        uiActions={uiActions}
        reviews={_reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        workActions={workActions}
        works={works}
      />);

    assert.isNotFalse(tree.subTree('.p-detail--campaign-diploma'), 'Found campaign-diploma container');
  });

  it('Should not render campaignDiplomaButtons when looking at someone elses profile', () => {
    const _reviews = assignToEmpty(reviews, {userReviews: reviewsMock});

    const tree = sd.shallowRender(
      <ProfileDetailContainer
        feed={feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={moderatorMock} // the users we're looking at
        ui={uiMock}
        uiActions={uiActions}
        reviews={_reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        workActions={workActions}
        works={works}
      />);

    assert.isFalse(tree.subTree('.p-detail--campaign-diploma'), 'Did not find campaign-diploma container as expected');
  });

  it('Should not render campaignDiplomaButtons when no reviews have been created by user', () => {
    const tree = sd.shallowRender(
      <ProfileDetailContainer
        feed={feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={moderatorMock} // the users we're looking at
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        workActions={workActions}
        works={works}
      />);

    assert.isFalse(tree.subTree('.p-detail--campaign-diploma'), 'Did not find campaign-diploma container as expected');
  });

  it('Should not render campaignDiplomaButtons when no reviews have been associated with a campaign', () => {
    const _reviews = assignToEmpty(reviews, {
      userReviews: reviewsMock.map((review) => {
        review.campaign = null;
        return review;
      })
    });

    const tree = sd.shallowRender(
      <ProfileDetailContainer
        feed={feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={feedMock.profile} // the users we're looking at
        ui={uiMock}
        uiActions={uiActions}
        reviews={_reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        workActions={workActions}
        works={works}
      />);

    assert.isFalse(tree.subTree('.p-detail--campaign-diploma'), 'Did not find campaign-diploma container as expected');
  });
});
