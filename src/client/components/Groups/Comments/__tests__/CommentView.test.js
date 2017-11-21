import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
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
    const wrapper = shallow(<CommentView {...props} />);

    expect(wrapper.find('.comment-profile-image').first().find('img').props().src).to.equal(props.owner.image);
    expect(wrapper.find('.comment-profile-image').first().find('img').props().alt).to.equal(props.owner.displayName);
    expect(wrapper.find('.username').html()).to.equal(`<span class="username">${props.owner.displayName}</span>`);
    expect(wrapper.find('.time').text()).to.equal('Lige nu');
    expect(wrapper.find('.content').props().dangerouslySetInnerHTML.__html).to.equal(props.content);
    expect(wrapper.find('.media').first().find('img').props().src).to.equal(props.image);
  });

  it('it should not show an image', () => {
    props.image = null;
    const wrapper = shallow(<CommentView {...props} />);
    expect(wrapper.find('.media')).to.have.lengthOf(0);
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
