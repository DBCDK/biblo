import React from 'react';
import {expect} from 'chai';
import sd from 'skin-deep';

import CommentView from '../CommentView.component';

describe('Test of Comment Components', () => {
  const noop = () => {};
  const props = {
    content: 'test content',
    html: 'test content',
    image: 'some_url',
    timeCreated: (new Date()).toISOString(),
    owner: {
      id: 1,
      displayName: 'testUser',
      image: 'some_profile_image'
    },
    profile: {
      id: 1
    },
    uiActions: {},
    submitFlagFunction: noop,
    groupActions: {},
    coverImages: {},
    works: {}
  };

  it('it should show generate html', () => {
    const tree = sd.shallowRender(<CommentView {...props} />);

    expect(tree.subTree('.comment-profile-image').subTree('img').getRenderOutput().props.src).to.be.equal(props.owner.image);
    expect(tree.subTree('.comment-profile-image').subTree('img').getRenderOutput().props.alt).to.be.equal(props.owner.displayName);
    expect(tree.subTree('.username').toString()).to.be.equal(`<span class="username">${props.owner.displayName}</span>`);
    expect(tree.subTree('.time').text()).to.be.equal('Lige nu');
    expect(tree.subTree('.content').props.dangerouslySetInnerHTML.__html).to.be.equal(props.content);
    expect(tree.subTree('.media').subTree('img').getRenderOutput().props.src).to.be.equal(props.image);
  });

  it('it should not show an image', () => {
    props.image = null;
    const tree = sd.shallowRender(<CommentView {...props} />);

    expect(tree.subTree('.media')).to.be.equal(false);
  });

  it('it should not show an youtube video', () => {
    const tree = sd.shallowRender(<CommentView {...props} />);

    expect(tree.subTree('.comment--youtube-container')).to.be.equal(false);
  });

  it('it should show an youtube video', () => {
    props.content = 'some text containing a youtube link https://youtu.be/D9TpswDIBS8';
    const tree = sd.shallowRender(<CommentView {...props} />);

    expect(tree.subTree('.comment--youtube-container')).to.be.not.equal(false);
  });
});
