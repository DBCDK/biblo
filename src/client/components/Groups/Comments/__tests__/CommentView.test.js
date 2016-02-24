'use strict';

import React from 'react';
import {expect} from 'chai';
import sd from 'skin-deep';

import CommentView from '../CommentView.component';

describe('Test of Comment Components', () => {
  const props = {
    content: 'test content',
    image: 'some_url',
    timeCreated: (new Date()).getUTCDate(),
    owner: {
      displayName: 'testUser',
      image: 'some_profile_image'
    }
  };

  it('it should show generate html', () => {
    const tree = sd.shallowRender(<CommentView {...props} />);

    expect(tree.subTree('.comment-profile-image').subTree('img').getRenderOutput().props.src).to.be.equal(props.owner.image);
    expect(tree.subTree('.comment-profile-image').subTree('img').getRenderOutput().props.alt).to.be.equal(props.owner.displayName);
    expect(tree.subTree('.username').text()).to.be.equal(props.owner.displayName);
    expect(tree.subTree('.time').text()).to.be.equal('Lige nu');
    expect(tree.subTree('.content').text()).to.be.equal(props.content);
    expect(tree.subTree('.media').subTree('img').getRenderOutput().props.src).to.be.equal(props.image);
  });

  it('it should not show an image', () => {
    props.image = null;
    const tree = sd.shallowRender(<CommentView {...props} />);

    expect(tree.subTree('.media')).to.be.equal(false);
  });
});
