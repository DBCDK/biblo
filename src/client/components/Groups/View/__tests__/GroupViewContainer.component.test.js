/**
 * @file
 */

import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import AddContent from '../../AddContent/AddContent.component';

import {GroupViewContainer} from '../GroupViewContainer.component.js';

describe('Test GroupView Component', () => {
  const group = {
    color: null,
    description: 'test description',
    groupownerid: 1,
    id: 1,
    image: 'test_image',
    name: 'test name',
    posts: [],
    postsCount: 0,
    owner: {
      id: 1
    },
    members: [],
    membersCount: 7356,
    isMembersExpanded: true
  };

  const profile = {
    userIsLoggedIn: true
  };

  const ui = {
    modal: {
      isOpen: false,
      children: null
    }
  };

  const noop = () => {};

  // actions for this test (just use spies)
  let groupActions = {
    changeGroupColour: noop,
    asyncChangeImage: noop,
    addPost: noop,
    asyncGetGroupMembers: noop,
    asyncListenToGroupForNewContent: noop
  };

  let uiActions = {
    openModalWindow: noop,
    closeModalWindow: noop
  };

  let coverImageActions = {
    asyncGetCoverImage: noop,
    asyncListenForCoverImages: noop
  };

  let profileActions = {
    asyncGetUserReviews: noop
  };

  it('Group View Component is being rendered', () => {
    const wrapper = shallow(
      <GroupViewContainer
        globalState={{}}
        group={group}
        profile={profile}
        groupActions={groupActions}
        uiActions={uiActions}
        profileActions={profileActions}
        ui={ui}
        coverImageActions={coverImageActions}
        coverImages={{}}
        searchActions={{}}
        searchState={{}}
      />
    );

    expect(`<p class="group--description">${group.description}</p>`).to.equal(wrapper.find('.group--description').html());
    expect(`<h2 class="group--title">${group.name}</h2>`).to.equal(wrapper.find('.group--title').html());

    // AddContent form is added with props
    expect(wrapper.find('AddContent').type()).to.equal(AddContent);
    expect(wrapper.find('AddContent').props()).to.deep.equal({
      redirectTo: '/grupper/1',
      profile,
      getMoreWorks: noop,
      addContentAction: noop,
      works: {},
      parentId: 1,
      type: 'post',
      coverImages: {},
      displayAbortButton: false,
      pdfUploads: true,
      editing: false
    });

    expect(wrapper.find('.group--post-view').find('h2').text()).to.equal('0 brugere skriver');

    // No posts renedered Posts
    expect(wrapper.find('PostList').html()).to.equal('<div class="post-list"></div>');
  });

  it('Group View Rendered with posts', () => {
    const newGroup = Object.assign({}, group, {
      posts: [{
        comments: [],
        content: 'test',
        groupid: 1,
        id: 1,
        image: null,
        owner: {
          displayName: 'Søren Hestevennen',
          id: 1,
          image: null
        },
        postid: 1,
        postownerid: 1,
        timeCreated: '2016-02-19T12:34:11.000Z',
        title: ' ',
        isMembersExpanded: true,
        groupIsClosed: false
      }], postsCount: 1
    });
    const actions = {
      asyncGetGroupMembers: noop,
      asyncListenToGroupForNewContent: noop
    };

    const wrapper = shallow(
      <GroupViewContainer
        globalState={{}}
        group={newGroup}
        profile={profile}
        groupActions={actions}
        uiActions={uiActions}
        profileActions={profileActions}
        ui={ui}
        coverImageActions={coverImageActions}
        coverImages={{}}
        searchActions={{}}
        searchState={{}}
      />
    );

    expect(wrapper.find('.group--post-view').find('h2').text()).to.equal('1 bruger skriver');
  });
});
