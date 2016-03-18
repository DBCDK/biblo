'use strict';

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
    members: []
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

  it('Group View Component is being rendered', () => {
    const tree = sd.shallowRender(<GroupViewContainer group={group} profile={profile} groupActions={groupActions} uiActions={uiActions} ui={ui} />);
    assert.equal(group.description, tree.subTree('.group--description').text());
    assert.equal(group.name, tree.subTree('.group--title').text());

    // AddContent form is added with props
    assert.equal(tree.subTree('AddContent').getRenderOutput().type, AddContent);
    assert.deepEqual(tree.subTree('AddContent').getRenderOutput().props, {
      redirectTo: '/grupper/1',
      profile,
      addContentAction: noop,
      parentId: 1,
      type: 'post'
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
      title: ' '
    }];
    group.postsCount = 1;
    const actions = {};

    const tree = sd.shallowRender(<GroupViewContainer group={group} profile={profile} groupActions={actions} uiActions={uiActions} ui={ui} />);
    assert.equal(tree.subTree('.group--post-view').textIn('h2'), '1 bruger skriver');
  });
});
