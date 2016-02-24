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
    posts: []
  };

  const profile = {
    userIsLoggedIn: true
  };

  it('Group View Component is being rendered', () => {
    const tree = sd.shallowRender(<GroupViewContainer group={group} profile={profile}/>);
    assert.equal(group.description, tree.subTree('.group--description').text());
    assert.equal(group.name, tree.subTree('.group--title').text());

    // AddContent form is added with props
    assert.equal(tree.subTree('AddContent').getRenderOutput().type, AddContent);
    assert.deepEqual(tree.subTree('AddContent').getRenderOutput().props, {redirectTo: '/grupper/1', profile, parentId: 1, type: 'post'});
    assert.equal(tree.subTree('.group--post-view').textIn('h2'), '0 brugere skriver');

    // No posts renedered Posts
    assert.equal(tree.subTree('PostList').toString(), '<div class="post-list"></div>');
  });

  it('Group View Rendered with posts', () => {
    group.posts= [{
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
    const tree = sd.shallowRender(<GroupViewContainer group={group} profile={profile}/>);
    assert.equal(tree.subTree('.group--post-view').textIn('h2'), '1 bruger skriver');
    assert.deepEqual(tree.subTree('PostList').getRenderOutput().props, {posts: group.posts, profile, groupId: group.id });
  });
});
