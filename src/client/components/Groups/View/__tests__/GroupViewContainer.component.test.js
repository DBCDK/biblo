/**
 * @file
 */

import React from 'react';
import {assert} from 'chai';
import sd from 'skin-deep';
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
    addPost: noop
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
    const tree = sd.shallowRender(
      <GroupViewContainer
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
    assert.equal(`<p class="group--description">${group.description}</p>`, tree.subTree('.group--description').toString());
    assert.equal(`<h2 class="group--title">${group.name}</h2>`, tree.subTree('.group--title').toString());

    // AddContent form is added with props
    assert.equal(tree.subTree('AddContent').getRenderOutput().type, AddContent);
    assert.deepEqual(tree.subTree('AddContent').getRenderOutput().props, {
      redirectTo: '/grupper/1',
      profile,
      getMoreWorks: noop,
      addContentAction: noop,
      works: {},
      parentId: 1,
      type: 'post',
      coverImages: {}
    });
    assert.equal(tree.subTree('.group--post-view').textIn('h2'), '0 brugere skriver');

    // No posts renedered Posts
    assert.equal(tree.subTree('PostList').toString(), '<div class="post-list"></div>');
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
    const actions = {};

    const tree = sd.shallowRender(
      <GroupViewContainer
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
    assert.equal(tree.subTree('.group--post-view').textIn('h2'), '1 bruger skriver');
  });
});
