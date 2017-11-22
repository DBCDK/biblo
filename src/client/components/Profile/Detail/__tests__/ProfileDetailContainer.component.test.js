/**
 * @file: Tests for profile detail container (also known as public profile).
 */

// import libs
import React from 'react';
import {expect} from 'chai';
import {mount, shallow} from 'enzyme';
import assignToEmpty from '../../../../Utils/assign';

// import components
import {ProfileDetailContainer} from '../ProfileDetailContainer.component';

// import mocks
import {profileMock, moderatorMock} from '../../../__mocks__/profile.mock';
import {feedMock, moderatedFeedMock} from '../../../__mocks__/feed.mock';
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

  const profileActions = {
    asyncMarkUserMessageAsRead: noop,
    asyncDeleteUserMessage: noop
  };

  const workActions = {
    asyncGetWorks: noop
  };

  const userstatusActions = {
    asyncRenewLoan: noop
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

  const campaignsMock = [{
    campaignName: 'Sommerbogen 2016',
    startDate: '2016-06-09T20:00:00.044Z',
    endDate: '2016-08-21T04:00:00.044Z',
    logos: {
      svg: '/sommerbogen-logo.svg',
      small: '/sommerbogen-logo.png',
      medium: '/sommerbogen-logo.png',
      large: '/sommerbogen-logo.png'
    },
    type: 'review',
    id: 1,
    workTypes: ['book', 'audiobook', 'literature']
  }, {
    campaignName: 'Skriv din egen historie',
    startDate: '2016-07-20T00:00:00.000Z',
    endDate: '2016-12-25T00:00:00.000Z',
    logos: {
      small: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png',
      medium: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png',
      large: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png',
      svg: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png'
    },
    type: 'group',
    id: 2,
    workTypes: [],
    group: {
      name: 'Skriv din egen historie',
      description: 'Dette er en test kampagne gruppe!',
      colour: 'blue',
      timeCreated: '2016-07-25T09:03:23.000Z',
      id: 136,
      groupownerid: 323,
      campaignGroupFK: 2,
      campaign: {
        campaignName: 'Skriv din egen historie',
        startDate: '2016-07-20T00:00:00.000Z',
        endDate: '2016-12-25T00:00:00.000Z',
        logos: {
          small: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png',
          medium: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png',
          large: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png',
          svg: 'https://cdn0.iconfinder.com/data/icons/70-basic-icons/100/write-128.png'
        },
        type: 'group',
        id: 2,
        workTypes: []
      },
      isClosed: false
    }
  }];

  it('should render activity rows containing posts, and a comment', () => {
    const component = (
      <ProfileDetailContainer
        agencies={{}}
        agencyActions={{}}
        searchState={searchState}
        feed={feedMock}
        feedActions={feedActions}
        flagActions={flagActions}
        globalState={{}}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={profileMock}
        profileActions={profileActions}
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        selectedTab={1}
        searchActions={searchActions}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        userstatusActions={userstatusActions}
        userstatusState={{}}
        workActions={workActions}
        works={works}
      />
    );

    const wrapper = mount(component);

    const activityRows = wrapper.find('.activity-row--container > .activity-row');

    expect(activityRows.at(0).text()).to.include(feedMock.feed[0].html);
    expect(activityRows.at(1).text()).to.include(feedMock.feed[1].html);
  });

  it('should render rows containing an edit link when a moderator is viewing', () => {
    const component = (
      <ProfileDetailContainer
        agencies={{}}
        agencyActions={{}}
        searchState={searchState}
        feed={moderatedFeedMock}
        feedActions={feedActions}
        flagActions={flagActions}
        globalState={{}}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={moderatorMock}
        profileActions={profileActions}
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        selectedTab={1}
        searchActions={searchActions}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        userstatusActions={userstatusActions}
        userstatusState={{}}
        workActions={workActions}
        works={works}
      />
    );

    const wrapper = mount(component);
    const postEditButtons = wrapper.find('.edit-post--button');
    const commentEditButtons = wrapper.find('.edit-comment--button');

    expect(postEditButtons.length).to.equal(4); // two posts, and two comments with posts wrapped around.
    expect(commentEditButtons.length).to.equal(2); // two comments.
  });

  it('should render tabs', () => {
    const component = (
      <ProfileDetailContainer
        agencies={{}}
        agencyActions={{}}
        searchState={searchState}
        feed={feedMock}
        feedActions={feedActions}
        flagActions={flagActions}
        globalState={{}}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={profileMock}
        profileActions={profileActions}
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        searchActions={searchActions}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        userstatusActions={userstatusActions}
        userstatusState={{}}
        workActions={workActions}
        works={works}
      />
    );

    const wrapper = mount(component);

    const tabs = wrapper.find('.p-detail--activity-tabs').children();
    expect(tabs.at(0).html()).to.include('tabs-container');
  });

  it('Should render diplomaButtons', () => {
    const _reviews = assignToEmpty(reviews, {userReviews: reviewsMock});
    const _feedMock = assignToEmpty(feedMock, {campaigns: campaignsMock});

    const wrapper = shallow(
      <ProfileDetailContainer
        agencies={{}}
        agencyActions={{}}
        feed={_feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        globalState={{}}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={feedMock.profile} // the users we're looking at
        profileActions={profileActions}
        ui={uiMock}
        uiActions={uiActions}
        reviews={_reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        userstatusActions={userstatusActions}
        userstatusState={{}}
        workActions={workActions}
        works={works}
      />);

    expect(wrapper.find('.p-detail--diploma')).to.have.lengthOf(2);
  });

  it('Should not render campaignDiplomaButtons when looking at someone elses profile', () => {
    const _reviews = assignToEmpty(reviews, {userReviews: reviewsMock});

    const wrapper = shallow(
      <ProfileDetailContainer
        agencies={{}}
        agencyActions={{}}
        feed={feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        globalState={{}}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={moderatorMock} // the users we're looking at
        profileActions={profileActions}
        ui={uiMock}
        uiActions={uiActions}
        reviews={_reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        userstatusActions={userstatusActions}
        userstatusState={{}}
        workActions={workActions}
        works={works}
      />);

    expect(wrapper.find('.p-detail--campaign-diploma')).to.have.lengthOf(0);
  });

  it('Should not render campaignDiplomaButtons when no reviews have been created by user', () => {
    const wrapper = shallow(
      <ProfileDetailContainer
        agencies={{}}
        agencyActions={{}}
        feed={feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        globalState={{}}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={moderatorMock} // the users we're looking at
        profileActions={profileActions}
        ui={uiMock}
        uiActions={uiActions}
        reviews={reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        userstatusActions={userstatusActions}
        userstatusState={{}}
        workActions={workActions}
        works={works}
      />);

    expect(wrapper.find('.p-detail--campaign-diploma')).to.have.lengthOf(0);
  });

  it('Should not render campaignDiplomaButtons when no reviews have been associated with a campaign', () => {
    const _reviews = assignToEmpty(reviews, {
      userReviews: reviewsMock.map((review) => {
        review.campaign = null;
        return review;
      })
    });

    const wrapper = shallow(
      <ProfileDetailContainer
        agencies={{}}
        agencyActions={{}}
        feed={feedMock} // contains the current logged in user
        feedActions={feedActions}
        flagActions={flagActions}
        globalState={{}}
        group={group}
        groupActions={groupActions}
        likeActions={likeActions}
        profile={feedMock.profile} // the users we're looking at
        profileActions={profileActions}
        ui={uiMock}
        uiActions={uiActions}
        reviews={_reviews}
        coverImageActions={coverImageActions}
        coverImages={coverImages}
        searchState={searchState}
        searchActions={searchActions}
        userstatusActions={userstatusActions}
        userstatusState={{}}
        workActions={workActions}
        works={works}
      />);

    expect(wrapper.find('.p-detail--campaign-diploma')).to.have.lengthOf(0);
  });
});
