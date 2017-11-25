/**
 * @file
 */

import React from 'react';
import {assert} from 'chai';
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

    assert.equal(`<p class="group--description">${group.description}</p>`, wrapper.find('.group--description').html());
    assert.equal(`<h2 class="group--title">${group.name}</h2>`, wrapper.find('.group--title').html());

    // AddContent form is added with props
    assert.equal(wrapper.find('AddContent').type(), AddContent);
    assert.deepEqual(wrapper.find('AddContent').props(), {
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

    assert.equal(wrapper.find('.group--post-view').find('h2').text(), '0 brugere skriver');

    // No posts renedered Posts
    assert.equal(wrapper.find('PostList').html(), '<div class="post-list"></div>');
  });

  it('Group View Rendered with posts', () => {
    group.posts = [{
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
    }];
    group.postsCount = 1;
    const actions = {
      asyncGetGroupMembers: noop,
      asyncListenToGroupForNewContent: noop
    };

    const wrapper = shallow(
      <GroupViewContainer
        globalState={{}}
        group={group}
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
    assert.equal(wrapper.find('.group--post-view').find('h2').text(), '1 bruger skriver');
  });
});
